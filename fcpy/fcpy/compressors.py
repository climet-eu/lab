# (C) Copyright 2022 ECMWF.
#
# This software is licensed under the terms of the Apache Licence Version 2.0
# which can be obtained at http://www.apache.org/licenses/LICENSE-2.0.
# In applying this licence, ECMWF does not waive the privileges and immunities
# granted to it by virtue of its status as an intergovernmental organisation
# nor does it submit to any jurisdiction.
#

from abc import ABCMeta, abstractmethod
from typing import Optional, Tuple

import numpy as np

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
        s = type(self).__name__
        if self.inner_compressor:
            s = f"{s}({self.inner_compressor.name})"
        return s

    def compress(
        self, arr: np.ndarray, bits: Optional[int] = None
    ) -> Tuple[np.ndarray, list[dict]]:
        """Compress the given array.

        Args:
            arr (np.ndarray): Data to compress.
            bits (int, optional): Bits to use in compression.
                Defaults to bits passed in the constructor.

        Returns:
            Tuple[np.ndarray, list[dict]]:
                The compressed data with metadata of this and all
                inner compressors required for decompression.
        """
        bits = bits or self.bits
        assert bits is not None
        if self.inner_compressor:
            arr, params_stack = self.inner_compressor.compress(arr, bits=bits)
        else:
            params_stack = []
        c, params = self.do_compress(arr, bits)
        params_stack.insert(0, params)
        return c, params_stack

    def decompress(
        self, compressed_data: np.ndarray, params_stack: list[dict]
    ) -> np.ndarray:
        """Decompress the given data using the given compression metadata.

        Args:
            compressed_data (np.ndarray): The compressed data.
            params_stack (list[dict]): The compression metadata of this
                and all inner compressors.

        Returns:
            np.ndarray: The decompressed data.
        """
        params = params_stack.pop(0)
        d = self.do_decompress(compressed_data, params)
        if self.inner_compressor:
            d = self.inner_compressor.decompress(d, params_stack)
        return d

    @abstractmethod
    def do_compress(
        self, arr: np.ndarray, bits: int
    ) -> Tuple[np.ndarray, dict]:
        """Method to be implemented in compressor subclasses.
        Called by the base class during compress().

        Args:
            arr (np.ndarray): Data to compress.
            bits (int): Bits to use for compression.

        Returns:
            Tuple[np.ndarray, dict]: Compressed data with metadata required
                for decompression.
        """
        raise NotImplementedError

    @abstractmethod
    def do_decompress(
        self, compressed_data: np.ndarray, params: dict
    ) -> np.ndarray:
        """Method to be implemented in compressor subclasses.
        Called by the base class during decompress().

        Args:
            compressed_data (np.ndarray): The compressed data.
            params (dict): The compression metadata returned by do_compress().

        Returns:
            np.ndarray: The decompressed data.
        """
        raise NotImplementedError


class LinQuantization(Compressor):
    """Linear quantization compressor."""

    def do_compress(
        self, arr: np.ndarray, bits: int
    ) -> Tuple[np.ndarray, dict]:
        minimum = np.amin(arr)
        maximum = np.amax(arr)
        arr_compressed = np.round(
            (arr - minimum) / (maximum - minimum) * (2**bits - 1)
        )
        return arr_compressed, {
            "bits": bits,
            "minimum": minimum,
            "maximum": maximum,
        }

    def do_decompress(
        self, compressed_data: np.ndarray, params: dict
    ) -> np.ndarray:
        bits = params["bits"]
        minimum = params["minimum"]
        maximum = params["maximum"]
        arr_decompressed = (
            np.array(compressed_data) / (2**bits - 1) * (maximum - minimum)
            + minimum
        )
        return arr_decompressed


class Round(Compressor):
    """Rounding compressor."""

    def get_used_sign_and_exponent_bits(self, arr: np.ndarray) -> int:
        bits_params = get_bits_params(arr)
        used_sign_and_exponent_bits = compute_min_bits(arr, bits_params)

        return used_sign_and_exponent_bits

    def do_compress(
        self, arr: np.ndarray, bits: int
    ) -> Tuple[np.ndarray, dict]:
        used_sign_and_exponent_bits = self.get_used_sign_and_exponent_bits(arr)
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
            arr.dtype
        ).bits  # bit length of the array element type

        sint = getattr(
            np, f"int{total_bits}"
        )  # signed integer of matching bit length
        uint = getattr(
            np, f"uint{total_bits}"
        )  # unsigned integer of matching bit length

        significand_bits = np.finfo(arr.dtype).nmant
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
        shift = significand_bits - mantissa_bits  # normal case
        shift -= (
            mantissa_bits == significand_bits
        )  # to avoid round away from 0

        # mask to zero trailing mantissa bits
        keep_mask = (sint(~significand_mask) >> mantissa_bits).astype(uint)

        arr = np.copy(arr)
        ui_arr = arr.view(uint)  # bitpattern as uint
        ui_arr += ulp_half + (
            (ui_arr >> shift) & uint(1)
        )  # add ulp/2 with tie to even
        ui_arr &= keep_mask  # set trailing bits to zero

        return arr

    def do_decompress(
        self, compressed_data: np.ndarray, params: dict
    ) -> np.ndarray:
        return compressed_data


class Float(Compressor):
    """IEEE Floating-Point compressor."""

    DTYPE = {16: np.float16, 32: np.float32, 64: np.float64}

    def do_compress(
        self, arr: np.ndarray, bits: int
    ) -> Tuple[np.ndarray, dict]:
        dtype = self.DTYPE[bits]
        return arr.astype(dtype, copy=False), {}

    def do_decompress(
        self, compressed_data: np.ndarray, params: dict
    ) -> np.ndarray:
        return compressed_data


class Log(Compressor):
    """Log/Exp compressor, typically used for pre-/postprocessing."""

    def do_compress(
        self, arr: np.ndarray, bits: int
    ) -> Tuple[np.ndarray, dict]:
        return np.log1p(arr), {}

    def do_decompress(
        self, compressed_data: np.ndarray, params: dict
    ) -> np.ndarray:
        return np.expm1(compressed_data)


class Identity(Compressor):
    """Identity compressor, performs f(x)=x, i.e. no compression."""

    def do_compress(
        self, arr: np.ndarray, bits: int
    ) -> Tuple[np.ndarray, dict]:
        return arr, {}

    def do_decompress(
        self, compressed_data: np.ndarray, params: dict
    ) -> np.ndarray:
        return compressed_data


class PCA(Compressor):
    """Principal Component Analysis compressor."""

    def do_compress(
        self, arr: np.ndarray, bits: int
    ) -> Tuple[np.ndarray, dict]:
        import sklearn  # noqa: F401
        from sklearn.decomposition import PCA

        time, lev, lat, lon = arr.shape

        data = arr.reshape((time * lev, lat * lon))

        transformer = PCA(random_state=42, n_components=bits)
        compressed_data = transformer.fit_transform(data)

        return compressed_data, {
            "transformer": transformer,
            "shape": arr.shape,
        }

    def do_decompress(
        self, compressed_data: np.ndarray, params: dict
    ) -> np.array:
        time, lev, lat, lon = params["shape"]

        return (
            params["transformer"]
            .inverse_transform(compressed_data)
            .reshape((time, lev, lat, lon))
        )
