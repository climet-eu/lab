# (C) Copyright 2022 ECMWF.
#
# This software is licensed under the terms of the Apache Licence Version 2.0
# which can be obtained at http://www.apache.org/licenses/LICENSE-2.0.
# In applying this licence, ECMWF does not waive the privileges and immunities
# granted to it by virtue of its status as an intergovernmental organisation
# nor does it submit to any jurisdiction.
#

from abc import ABCMeta, abstractmethod

import dask
import xarray as xr


class Metric(metaclass=ABCMeta):
    """Base class for Metric subclasses."""

    name: str
    """Name of the metric.
    """

    @abstractmethod
    def compute(self, x: xr.DataArray, y: xr.DataArray) -> xr.DataArray:
        """Compute the metric with the given reference and computed data.

        Args:
            x (xr.DataArray): Reference data.
            y (xr.DataArray): Computed data.

        Returns:
            xr.DataArray: The values computed by the metric.
        """
        raise NotImplementedError


class Difference(Metric):
    """Difference metric: x - y."""

    name = "difference"

    def compute(self, x, y):
        return difference(x, y)


class RelativeError(Metric):
    """Relative error metric: |x - y| / |max(x) - min(x)|"""

    name = "relative error"

    def compute(self, x, y):
        return relative_error(x, y)


class AbsoluteError(Metric):
    """Absolute error metric: |x - y|"""

    name = "absolute error"

    def compute(self, x, y):
        return absolute_error(x, y)


def difference(x: xr.DataArray, y: xr.DataArray) -> xr.DataArray:
    return x - y


def absolute_error(x: xr.DataArray, y: xr.DataArray) -> xr.DataArray:
    return xr.apply_ufunc(dask.array.abs, x - y, dask="allowed")


def relative_error(x: xr.DataArray, y: xr.DataArray) -> xr.DataArray:
    return absolute_error(x, y) / xr.apply_ufunc(
        dask.array.abs, x.max() - x.min(), dask="allowed"
    )
