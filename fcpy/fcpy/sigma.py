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

from .utils import compute_z_score


@np.errstate(invalid="ignore")
def compute_dataarray_sigma(da: xr.DataArray) -> float:
    """Computes the sigma value comparing the provided data array
    with a random uniform-distributed noise field.

    Args:
        da (xr.DataArray): Reference data.

    Returns:
        float: Sigma value.
    """

    # https://stackoverflow.com/a/51052046/8893833
    from skimage.restoration import estimate_sigma

    # Compute a pseudo random noise field for reference
    arr_rand = np.random.uniform(0, 1, da.shape)

    da_normalised = compute_z_score(da)

    # TODO: how can this be run over many chunks?
    return estimate_sigma(da_normalised.squeeze().values) / estimate_sigma(
        arr_rand
    )
