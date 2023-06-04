# (C) Copyright 2022 ECMWF.
#
# This software is licensed under the terms of the Apache Licence Version 2.0
# which can be obtained at http://www.apache.org/licenses/LICENSE-2.0.
# In applying this licence, ECMWF does not waive the privileges and immunities
# granted to it by virtue of its status as an intergovernmental organisation
# nor does it submit to any jurisdiction.
#

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
