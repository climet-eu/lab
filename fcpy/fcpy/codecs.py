# (C) Copyright 2022 ECMWF.
#
# This software is licensed under the terms of the Apache Licence Version 2.0
# which can be obtained at http://www.apache.org/licenses/LICENSE-2.0.
# In applying this licence, ECMWF does not waive the privileges and immunities
# granted to it by virtue of its status as an intergovernmental organisation
# nor does it submit to any jurisdiction.
#

import numpy as np
from numcodecs.abc import Codec
from numcodecs.registry import register_codec
from numcodes.compat import (
    ensure_contiguous_ndarray_like,
    ensure_ndarray_like,
    ndarray_copy,
)


class Identity(Codec):
    """Identity filter which passes through the input on encoding
    and deecoding.

    """

    codec_id = "identity"

    def encode(self, buf):
        return buf

    def decode(self, buf, out=None):
        return ndarray_copy(buf, out)


register_codec(Identity)


class Log(Codec):
    """Log filter which calculates c = log(1+x) on encoding and
    d = exp(c)-1 on decoding.

    """

    codec_id = "log"

    def encode(self, buf):
        arr = ensure_ndarray_like(buf)

        if arr.dtype.kind != "f":
            raise ValueError("only floating point data types are supported")

        return np.log1p(arr)

    def decode(self, buf, out=None):
        arr = ensure_ndarray_like(buf)

        if arr.dtype.kind != "f":
            raise ValueError("only floating point data types are supported")

        return np.expm1(arr, out=out)


register_codec(Log)


class Standardize(Codec):
    """Standardize filter which standardizes the flattened data to have
    zero mean and unit standard deviation. The offset and scale factor
    are stored in an in-band header.

    Args:
        shape (Tuple[int, ...]): Shape of the provided data.
    """

    codec_id = "normalize"

    def __init__(self, shape):
        self.shape = shape

    def encode(self, buf):
        assert ensure_ndarray_like(buf).shape == self.shape

        arr = ensure_contiguous_ndarray_like(buf)

        if arr.dtype.kind != "f":
            raise ValueError("only floating point data types are supported")

        mean = np.mean(arr)
        stdv = np.std(arr)

        enc = np.empty(arr.size + 2, dtype=arr.dtype)
        enc[0] = 1.0 / mean
        enc[1] = 1.0 / stdv
        ndarray_copy((arr - mean) * (1.0 / stdv), enc[2:])

        return enc

    def decode(self, buf, out=None):
        arr = ensure_contiguous_ndarray_like(buf)

        if arr.dtype.kind != "f":
            raise ValueError("only floating point data types are supported")

        mean = 1.0 / arr[0]
        stdv = 1.0 / arr[1]

        return ndarray_copy(((arr[2:] * stdv) + mean).reshape(self.shape), out)


register_codec(Standardize)


class LinearQuantize(Codec):
    """Lossy filter to reduce the precision of floating point data. The data
    is quantized to unsigned integers of the best-fitting type. The range of
    the input data is stored in-band.

    Args:
        bits (int): Desired precision (number of binary digits).
        dtype (dtype): Data type to use for decoded data.
        shape (Tuple[int, ...]): Shape of the provided data.
    """

    codec_id = "linear-quantize"

    def __init__(self, bits, dtype, shape):
        self.bits = bits
        if self.bits <= 0 or self.bits > 64:
            raise ValueError("bits must be in range [1; 64]")
        self.dtype = np.dtype(dtype)
        if self.dtype.kind != "f":
            raise ValueError("only floating point data types are supported")
        self.shape = shape

    def encode(self, buf):
        assert ensure_ndarray_like(buf).shape == self.shape

        arr = ensure_contiguous_ndarray_like(buf).view(self.dtype)

        if self.bits <= 8:
            itype = np.uint8
        elif self.bits <= 16:
            itype = np.uint16
        elif self.bits <= 32:
            itype = np.uint32
        elif self.bits <= 64:
            itype = np.uint64

        minimum = np.amin(arr)
        maximum = np.amax(arr)

        arr_enc = np.around(
            (arr - minimum) / (maximum - minimum) * ((2**self.bits) - 1)
        ).astype(itype)

        dsize = arr.itemsize
        isize = arr_enc.itemsize
        hsize = (dsize + isize - 1) // isize

        enc = np.empty(arr_enc.size + hsize * 2, dtype=itype)
        enc[:hsize].view(self.dtype)[0] = minimum
        enc[hsize : hsize * 2].view(self.dtype)[0] = maximum
        ndarray_copy(arr_enc, enc[hsize * 2 :])

        return enc

    def decode(self, buf, out=None):
        if self.bits <= 8:
            itype = np.uint8
        elif self.bits <= 16:
            itype = np.uint16
        elif self.bits <= 32:
            itype = np.uint32
        elif self.bits <= 64:
            itype = np.uint64

        enc = ensure_contiguous_ndarray_like(buf).view(itype)

        dsize = np.empty(0, dtype=self.dtype).itemsize
        isize = enc.itemsize
        hsize = (dsize + isize - 1) // isize

        minimum = enc[:hsize].view(self.dtype)[0]
        maximum = enc[hsize : hsize * 2].view(self.dtype)[0]

        dec = (
            enc[hsize * 2 :].astype(self.dtype)
            / ((2**self.bits) - 1)
            * (maximum - minimum)
        ) + minimum

        return ndarray_copy(dec.reshape(self.shape), out)

    def get_config(self):
        # override to handle encoding dtypes
        return dict(
            id=self.codec_id,
            bits=self.bits,
            dtype=self.dtype.str,
            shape=self.shape,
        )

    def __repr__(self):
        return (
            f"{type(self).__name__}(bits={self.bits},"
            f" dtype={repr(self.dtype.str)}, shape={self.shape})"
        )


register_codec(LinearQuantize)
