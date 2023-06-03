# (C) Copyright 2022 ECMWF.
#
# This software is licensed under the terms of the Apache Licence Version 2.0
# which can be obtained at http://www.apache.org/licenses/LICENSE-2.0.
# In applying this licence, ECMWF does not waive the privileges and immunities
# granted to it by virtue of its status as an intergovernmental organisation
# nor does it submit to any jurisdiction.
#

import warnings
from abc import ABCMeta, abstractmethod
from typing import Optional, Tuple

import dask
import numpy as np
import xarray as xr

from .utils import compute_min_bits, get_bits_params


class Compressor(metaclass=ABCMeta):
    """Abstract base class for compressors.

    Args:
        inner_compressor (Compressor, optional): Inner compressor to use,
            if any.
        bits (int, optional): Bits to use for compression. If None, must be
            given when calling compress().
    """

    def __init__(
        self,
        inner_compressor: Optional["Compressor"] = None,
        bits: Optional[int] = None,
    ):
        if inner_compressor is not None:
            assert isinstance(inner_compressor, Compressor)
        self.inner_compressor = inner_compressor
        self.bits = bits

    @property
    def name(self) -> str:
        """Name of the compressor."""
        ty = type(self)

        return (
            f"{ty.__module__}.{ty.__qualname__}"
            f"({self.inner_compressor.name if self.inner_compressor else ''})"
        )

    def compress(
        self, data: xr.DataArray, bits: Optional[int] = None
    ) -> Tuple[xr.DataArray, list[dict]]:
        """Compress the given array.

        Args:
            data (xr.DataArray): Data to compress.
            bits (int, optional): Bits to use in compression.
                Defaults to bits passed in the constructor.

        Returns:
            Tuple[xr.DataArray, list[dict]]:
                The compressed data with metadata of this and all
                inner compressors required for decompression.
        """
        bits = bits or self.bits
        assert bits is not None

        if self.inner_compressor:
            data, params_stack = self.inner_compressor.compress(
                data, bits=bits
            )
        else:
            params_stack = []

        data_compressed, params = self.do_compress(data, bits)
        params_stack.insert(0, params)

        return data_compressed, params_stack

    def decompress(
        self, data_compressed: xr.DataArray, params_stack: list[dict]
    ) -> xr.DataArray:
        """Decompress the given data using the given compression metadata.

        Args:
            data_compressed (xr.DataArray): The compressed data.
            params_stack (list[dict]): The compression metadata of this
                and all inner compressors.

        Returns:
            xr.DataArray: The decompressed data.
        """
        params = params_stack.pop(0)
        data_decompressed = self.do_decompress(data_compressed, params)

        if self.inner_compressor:
            data_decompressed = self.inner_compressor.decompress(
                data_decompressed, params_stack
            )

        return data_decompressed

    @abstractmethod
    def do_compress(
        self, data: xr.DataArray, bits: int
    ) -> Tuple[xr.DataArray, dict]:
        """Method to be implemented in compressor subclasses.
        Called by the base class during compress().

        Args:
            data (xr.DataArray): Data to compress.
            bits (int): Bits to use for compression.

        Returns:
            Tuple[xr.DataArray, dict]: Compressed data with metadata required
                for decompression.
        """
        raise NotImplementedError

    @abstractmethod
    def do_decompress(
        self, data_compressed: xr.DataArray, params: dict
    ) -> xr.DataArray:
        """Method to be implemented in compressor subclasses.
        Called by the base class during decompress().

        Args:
            data_compressed (xr.DataArray): The compressed data.
            params (dict): The compression metadata returned by do_compress().

        Returns:
            xr.DataArray: The decompressed data.
        """
        raise NotImplementedError


class LinQuantization(Compressor):
    """Linear quantization compressor."""

    def do_compress(
        self, data: xr.DataArray, bits: int
    ) -> Tuple[xr.DataArray, dict]:
        minimum = data.min()
        maximum = data.max()

        data_compressed = (
            (data - minimum) / (maximum - minimum) * (2**bits - 1)
        ).round()

        return data_compressed, {
            "bits": bits,
            "minimum": minimum,
            "maximum": maximum,
        }

    def do_decompress(
        self, data_compressed: xr.DataArray, params: dict
    ) -> xr.DataArray:
        bits = params["bits"]
        minimum = params["minimum"]
        maximum = params["maximum"]

        data_decompressed = (
            data_compressed / (2**bits - 1) * (maximum - minimum)
        ) + minimum

        return data_decompressed


class Round(Compressor):
    """Rounding compressor."""

    def get_used_sign_and_exponent_bits(self, data: xr.DataArray) -> int:
        bits_params = get_bits_params(data)
        used_sign_and_exponent_bits = compute_min_bits(data, bits_params)

        return used_sign_and_exponent_bits

    def do_compress(
        self, data: xr.DataArray, bits: int
    ) -> Tuple[xr.DataArray, dict]:
        used_sign_and_exponent_bits = self.get_used_sign_and_exponent_bits(
            data
        )
        mantissa_bits = bits - used_sign_and_exponent_bits
        if mantissa_bits < 1:
            raise RuntimeError(
                "Round: mantissa bits < 1, use higher bits value"
            )

        # Adopted from Milan Klöwer's BitInformation Julia package
        # https://doi.org/10.5281/zenodo.4774191
        # Released under the MIT License
        # https://github.com/milankl/BitInformation.jl/blob/
        #  c13593e294d6b1341d906a3c1cd0984c45affa76/src/round_nearest.jl
        total_bits = np.finfo(
            data.dtype
        ).bits  # bit length of the array element type

        sint = getattr(
            np, f"int{total_bits}"
        )  # signed integer of matching bit length
        uint = getattr(
            np, f"uint{total_bits}"
        )  # unsigned integer of matching bit length

        significand_bits = np.finfo(data.dtype).nmant
        significand_mask = (
            sint([-1]).astype(uint) >> (total_bits - significand_bits)
        )[0]

        # half of unit in last place (ulp)
        # convert to signed for arithmetic bitshift
        # trick to push in 0s from the left and 1s from the right
        ulp_half = ~(sint(~significand_mask) >> (mantissa_bits + 1)).astype(
            uint
        )

        # integer used for bitshift
        shift = significand_bits - mantissa_bits

        if shift < 0:
            warnings.warn(
                "The rounding compression is a no-op since the dataset dtype"
                f" {data.dtype} does not support more than"
                f" {significand_bits} mantissa bits."
            )

            return data.copy(deep=False), {}

        # mask to zero trailing mantissa bits
        keep_mask = (sint(~significand_mask) >> mantissa_bits).astype(uint)

        # TODO: how to use xr.DataArray here?
        data_compressed = data.copy(deep=False)
        data_compressed_uint = data_compressed.view(uint)  # bitpattern as uint
        data_compressed_uint += ulp_half + (
            (data_compressed_uint >> shift) & uint(1)
        )  # add ulp/2 with tie to even
        data_compressed_uint &= keep_mask  # set trailing bits to zero

        return data_compressed, {}

    def do_decompress(
        self, data_compressed: xr.DataArray, params: dict
    ) -> xr.DataArray:
        return data_compressed.copy(deep=False)


class Float(Compressor):
    """IEEE Floating-Point compressor."""

    DTYPE = {16: np.float16, 32: np.float32, 64: np.float64}

    def do_compress(
        self, data: xr.DataArray, bits: int
    ) -> Tuple[xr.DataArray, dict]:
        dtype = data.dtype

        return data.astype(self.DTYPE[bits], copy=True), {"dtype": dtype}

    def do_decompress(
        self, data_compressed: xr.DataArray, params: dict
    ) -> xr.DataArray:
        return data_compressed.astype(params["dtype"], copy=True)


class Log(Compressor):
    """Log/Exp compressor, typically used for pre-/postprocessing."""

    def do_compress(
        self, data: xr.DataArray, bits: int
    ) -> Tuple[xr.DataArray, dict]:
        return xr.apply_ufunc(dask.array.log1p, data, dask="allowed"), {}

    def do_decompress(
        self, data_compressed: xr.DataArray, params: dict
    ) -> xr.DataArray:
        return xr.apply_ufunc(
            dask.array.expm1, data_compressed, dask="allowed"
        )


class Identity(Compressor):
    """Identity compressor, performs f(x)=x, i.e. no compression."""

    def do_compress(
        self, data: xr.DataArray, bits: int
    ) -> Tuple[xr.DataArray, dict]:
        return data.copy(deep=False), {}

    def do_decompress(
        self, data_compressed: xr.DataArray, params: dict
    ) -> xr.DataArray:
        return data_compressed.copy(deep=False)
