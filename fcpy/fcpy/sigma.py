# (C) Copyright 2022 ECMWF.
#
# This software is licensed under the terms of the Apache Licence Version 2.0
# which can be obtained at http://www.apache.org/licenses/LICENSE-2.0.
# In applying this licence, ECMWF does not waive the privileges and immunities
# granted to it by virtue of its status as an intergovernmental organisation
# nor does it submit to any jurisdiction.
#

import math
from itertools import product

import matplotlib.pyplot as plt
import numpy as np
import xarray as xr
from kneed import KneeLocator
from tqdm import tqdm

import fcpy

from .suite import run_compressor_single
from .utils import compute_min_bits, compute_z_score, get_bits_params


@np.errstate(invalid="ignore")
def compute_sigmas(da: xr.DataArray, compressors: list) -> xr.DataArray:
    """Computes a DataArray of sigmas based on a random uniform-distributed
    noise field.

    Args:
        da (xr.DataArray): Reference data.
        compressors (list): List of compressors.

    Returns:
        xr.DataArray: Sigma values.
    """

    # https://stackoverflow.com/a/51052046/8893833
    import numpy as np
    from skimage.restoration import estimate_sigma

    # Compute a pseudo random as reference
    arr_rand = np.random.uniform(0, 1, da.shape)

    # Ensure that the number of bits is valid for Round
    bits_params = get_bits_params(da)
    if "Round" or "Log" in [c.name for c in compressors]:
        # FIXME: We add one to the minimum??
        bits_min = compute_min_bits(da, bits_params) + 1
        bits_max = bits_params["width"]
        bits = range(bits_min, bits_max + 1)
    else:
        bits = bits_params["width"]

    da_sigmas = xr.DataArray(
        np.nan,
        name=da.name,
        dims=["compressor", "bits"],
        coords={
            "compressor": [c.name for c in compressors],
            "bits": bits,
        },
    )

    if (da.values.ravel() == da.values.ravel()[0]).all():
        print("All values are the same, skipping sigma calculation")
        return da_sigmas

    for compressor in da_sigmas.compressor:
        print(f"Compressor: {compressor.values}")
        for bits in tqdm(da_sigmas.bits):
            try:
                da_decompressed = run_compressor_single(
                    da,
                    eval(f"fcpy.{compressor.values}()"),
                    int(bits.values),
                )
            except Exception:
                import traceback

                trace = traceback.format_exc()
                print(f"Failed: bits={bits} compressor={compressor.values}")
                print(trace)
                continue
            da_diff = da_decompressed - da
            # Standardize to same range as arr_rand
            da_diff_normalised = compute_z_score(da_diff)
            sigma_ratio = estimate_sigma(
                da_diff_normalised.squeeze().values
            ) / estimate_sigma(arr_rand)
            idx = {"compressor": compressor, "bits": bits}
            da_sigmas.loc[idx] = sigma_ratio
    return da_sigmas


def compute_knees_field(
    da: xr.DataArray,
    da_sigmas: xr.DataArray,
    plot=False,
    interp_method="polynomial",
    polynomial_degree=4,
) -> dict:
    """Computes the point of maximum curvature.

    Args:
        da (xr.DataArray): Reference DataArray.
        da_sigmas (xr.DataArray): DataArray of Sigmas.
        plot (bool, optional): Whether to plot. Defaults to False.
        interp_method (str, optional): Method of interpolation to use by the
            knee finding algorithm. Defaults to "polynomial".
        polynomial_degree (int, optional): Degree of polynomial to use by the
            knee finding algorithm. Defaults to 4.

    Returns:
        dict: Dictionary of DataArrays of number of bits and sigmas.
    """
    if "lat" in da.coords:
        spatial_coords = ["lat", "lon"]
    elif "latitude" in da.coords:
        spatial_coords = ["latitude", "longitude"]
    da_bits_knee = xr.DataArray(
        np.nan,
        name="bits",
        coords=da.squeeze().drop(spatial_coords).coords,
    )
    assert da_bits_knee.size == 1, da_bits_knee.size

    da_bits_knee = da_bits_knee.squeeze()
    da_bits_knee = da_bits_knee.expand_dims(
        compressor=da_sigmas.compressor
    ).copy()
    da_sigmas_knee = xr.full_like(da_bits_knee, np.nan).rename("sigma")

    for compressor in da_bits_knee.compressor:
        da_sigma = da_sigmas.sel(compressor=compressor).dropna(dim="bits")
        if np.isnan(da_sigma.values).all():
            continue
        kl = KneeLocator(
            da_sigma.bits,
            da_sigma.values,
            curve="concave",
            direction="increasing",
            online=True,
            interp_method=interp_method,
            polynomial_degree=polynomial_degree,
        )
        if kl.knee is None:
            continue
        idx = {"compressor": compressor}
        da_bits_knee.loc[idx] = kl.knee
        da_sigmas_knee.loc[idx] = da_sigma.sel(bits=kl.knee).values

        if plot:
            kl.plot_knee(figsize=(5, 4.5))
            xint = range(min(kl.x), math.ceil(max(kl.x)) + 1)
            plt.xticks(xint)
            plt.locator_params(nbins=12)
            plt.xlabel("Number of bits")
            plt.ylabel("Z test statistic score")
            plt.title(
                "Knee/Elbow for air specific humidity, \n"
                + f"{da_bits_knee.loc[idx].coords}"
            )
            plt.show()

    return dict(bits=da_bits_knee, sigmas=da_sigmas_knee)


def sigmas_iterate_da(da, compressors, plot=False) -> xr.Dataset:
    """Computes sigmas for a given dataarray and compressors.

    Args:
        da (xr.DataArray): DataArray to compute sigmas for.
        compressors (list): List of compressors to compute sigmas for.

    Returns:
        xr.Dataset: Dataset with sigmas computed.
    """

    # First we find out all other dimensions except for the latitude and
    #  longitude as defined for a field
    other_dims = [
        dim
        for dim in da.dims
        if da[dim].attrs.get("standard_name", dim)
        not in ["latitude", "longitude", "values"]
    ]
    spatial_dims = {dim: 0 for dim in da.dims if dim not in other_dims}

    # Then create a dictionary with dim keys and values
    d_dims = {i: da[i].values for i in other_dims}

    # Create a mesh with all the combinrations that we want to iterate through
    mesh = [val for val in product(*d_dims.values())]
    # Create a mapping dim keys and values so we can use in the selection
    dims_mapping = []
    for m in mesh:
        d_tmp = {}
        for i, dim in enumerate(other_dims):
            d_tmp[dim] = m[i]
        dims_mapping.append(d_tmp)

    # Create dataarray
    compressors_ = [c.name for c in compressors]
    da_ = xr.full_like(
        da.isel(**spatial_dims).drop(list(spatial_dims), errors="ignore"),
        np.nan,
    )
    da_bits = da_.expand_dims(compressor=compressors_).copy().rename("bits")
    da_sigma = xr.full_like(da_bits, np.nan).rename("sigma")
    da_bitinf = xr.full_like(da_bits, np.nan).rename("bitinf")

    # Do not use metadata from reference da
    da_bits.attrs = {}
    da_sigma.attrs = {}
    da_bitinf.attrs = {}

    for sel in dims_mapping:
        da_reference = da.sel(sel)
        da_sigmas = compute_sigmas(da_reference, compressors)
        da_knees = compute_knees_field(da_reference, da_sigmas, plot=plot)
        da_bits.loc[sel] = da_knees["bits"]
        da_sigma.loc[sel] = da_knees["sigmas"]
        da_bitinf.loc[sel] = fcpy.compute_required_bits_single_variable(
            da_reference, fcpy.get_field_chunk_fn(da_reference), [0.99]
        )[0][0]
    return xr.merge([dict(bits=da_bits, sigmas=da_sigma, bitinf=da_bitinf)])


def sigmas_iterate_ds(ds: xr.Dataset, compressors: list, plot=False) -> dict:
    """Computes sigmas for a given dataset and compressors.

    Args:
        ds (xr.Dataset): Dataset to compute sigmas for.
        compressors (list): List of compressors to compute sigmas for.
        plot (bool, optional): Whether to generate a plot. Defaults to False.

    Returns:
        dict: dictionary of Datasets with sigmas computed.
    """

    out = {}
    for var_name in ds:
        print(var_name)
        da = ds[var_name]
        ds_out = sigmas_iterate_da(da, compressors, plot=plot)
        ds_out.attrs["var_name"] = var_name
        ds_out.attrs["long_name"] = da.attrs["long_name"]
        ds_out.attrs["units"] = da.attrs["units"]
        out[var_name] = ds_out
    return out
