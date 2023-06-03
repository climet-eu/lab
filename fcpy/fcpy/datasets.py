# (C) Copyright 2022 ECMWF.
#
# This software is licensed under the terms of the Apache Licence Version 2.0
# which can be obtained at http://www.apache.org/licenses/LICENSE-2.0.
# In applying this licence, ECMWF does not waive the privileges and immunities
# granted to it by virtue of its status as an intergovernmental organisation
# nor does it submit to any jurisdiction.
#

import glob
import warnings
from pathlib import Path

import xarray as xr

from .utils import is_gridded


def open_dataset(filepath, *args, **kwargs) -> xr.Dataset:
    """Open a dataset from one or more local files.
    Additional arguments are passed into `xr.open_mfdataset`.

    Args:
        filepath (str): .grib or .nc, may contain wildcards.

    Returns:
        xr.Dataset: The loaded dataset.
    """

    if "cache" not in kwargs:
        kwargs["cache"] = False

    if Path(filepath).suffix == ".grib":
        if "backend_kwargs" not in kwargs:
            kwargs["backend_kwargs"] = dict(indexpath="")
        elif "indexpath" not in kwargs["backend_kwargs"]:
            kwargs["backend_kwargs"]["indexpath"] = ""

    ds = xr.open_mfdataset(filepath, *args, **kwargs)

    if not is_gridded(ds):
        warnings.warn(
            "The loaded dataset is not gridded along the standard 'latitude' "
            "and 'longitude' axes."
        )

    path = glob.glob(filepath)[0]
    ds.attrs["path"] = path

    return ds
