# (C) Copyright 2022 ECMWF.
#
# This software is licensed under the terms of the Apache Licence Version 2.0
# which can be obtained at http://www.apache.org/licenses/LICENSE-2.0.
# In applying this licence, ECMWF does not waive the privileges and immunities
# granted to it by virtue of its status as an intergovernmental organisation
# nor does it submit to any jurisdiction.
#

import numpy as np
import xarray as xr

STANDARD_NAME_LAT = "latitude"
STANDARD_NAME_LON = "longitude"


def get_standard_name_dims(ds: xr.Dataset) -> dict:
    """Return the standard_name of each dimention in the dataset

    Args:
        ds (xr.Dataset): _description_

    Returns:
        dict: _description_
    """
    return {
        c.standard_name: c.name
        for c in [ds[dim] for dim in ds.dims]
        if "standard_name" in c.attrs
    }


def is_gridded(ds: xr.Dataset) -> bool:
    """Return if the dataset is gridded along the standard latitude and
    longitude axes.

    Args:
        ds (xr.Dataset): _description_

    Returns:
        bool: _description_
    """
    standard_names = get_standard_name_dims(ds)

    return (
        STANDARD_NAME_LAT in standard_names
        and STANDARD_NAME_LON in standard_names
    )


def compute_z_score(da: xr.DataArray) -> xr.DataArray:
    """Normalize array to [0,1]"""
    return (da - da.min()) / (da.max() - da.min())


def get_bits_params(da: xr.DataArray) -> dict:
    if da.dtype == np.float32:
        dtype_int = np.uint32
        width = 32
        sign_and_exponent_bits = 9
    elif da.dtype == np.float64:
        dtype_int = np.uint64
        width = 64
        sign_and_exponent_bits = 12
    else:
        raise RuntimeError("unsupported dtype")
    return dict(
        dtype_int=dtype_int,
        width=width,
        sign_and_exponent_bits=sign_and_exponent_bits,
    )


def to_bits(da, bits_params):
    value_range = np.linspace(da.min(), da.max(), 10000).astype(da.dtype)
    l = []  # TODO: what does this do?
    for i in value_range:
        l.append(
            np.array(
                list(
                    np.binary_repr(
                        int(i.view(dtype=bits_params["dtype_int"])),
                        width=bits_params["width"],
                    )
                ),
                dtype=bits_params["dtype_int"],
            )
        )
    l = np.vstack(l)
    l2 = []
    for i in range(l.shape[1]):
        l2.append(l[:, i])

    return np.array(l2)


def compute_min_bits(da, bits_params):
    bits_arr = to_bits(da, bits_params)
    used_sign_and_exponent_bits = 0
    for col in range(bits_params["sign_and_exponent_bits"]):
        if all(bits_arr[col, :] == 0) or all(bits_arr[col, :] == 1):
            continue
        used_sign_and_exponent_bits += 1
    return used_sign_and_exponent_bits
