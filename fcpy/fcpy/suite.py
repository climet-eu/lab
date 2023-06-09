# (C) Copyright 2022 ECMWF.
#
# This software is licensed under the terms of the Apache Licence Version 2.0
# which can be obtained at http://www.apache.org/licenses/LICENSE-2.0.
# In applying this licence, ECMWF does not waive the privileges and immunities
# granted to it by virtue of its status as an intergovernmental organisation
# nor does it submit to any jurisdiction.
#

from typing import Tuple, Union

import cartopy.crs as ccrs
import matplotlib.pyplot as plt
import numpy as np
import xarray as xr
from matplotlib.axes import Axes
from matplotlib.figure import Figure
from numcodecs.abc import Codec

from .utils import is_gridded


def compress_decompress_dataarray_single_chunk(
    da: xr.DataArray, compressor: Union[Codec, list[Codec]]
) -> xr.DataArray:
    """Perform compression and decompression on the provided data array
    to examine the effect of compression.

    Note that the full data is loaded into memory, ignoring any chunking
    that the data array may have. Please use
    `compress_decompress_data_array_chunked` instead to apply compression
    on a chunk-by-chunk basis, thus reducing the memory usage.

    Args:
        da (xr.DataArray): _description_
        compressor (Union[Codec, list[Codec]]): either a single compressor
            codec or a stack of codecs.
            Note that compression is applied from left to right, i.e. the
            rightmost codec will be applied last. Decompression is applied
            in reverse.

    Returns:
        xr.DataArray: the reconstructed data array
    """
    compressors = compressor if isinstance(compressor, list) else [compressor]

    encoded = np.ascontiguousarray(da.values)

    silhouettes = []

    for c in compressors:
        silhouettes.append((encoded.shape, encoded.dtype))
        encoded = c.encode(encoded)

    decoded = encoded

    for d in compressors[::-1]:
        shape, dtype = silhouettes.pop()
        out = np.empty(shape=shape, dtype=dtype)

        decoded = d.decode(decoded, out).reshape(shape)

    return da.copy(deep=False, data=decoded).chunk([-1] * len(da.shape))


def compress_decompress_dataarray_chunked(
    da: xr.DataArray,
    compressor: Union[Codec, list[Codec]],
) -> xr.DataArray:
    """Perform compression and decompression on the provided data array
    to examine the effect of compression.

    Args:
        da (xr.DataArray): _description_
        compressor (Union[Codec, list[Codec]]): either a single compressor
            codec or a stack of codecs.
            Note that compression is applied from left to right, i.e. the
            rightmost codec will be applied last. Decompression is applied
            in reverse.

    Returns:
        xr.DataArray: the reconstructed data array
    """

    # Encoding and decoding must be run together as xr.map_blocks is still *very* brittle
    return xr.map_blocks(
        compress_decompress_dataarray_single_chunk,
        da,
        kwargs=dict(compressor=compressor),
    )


def compress_decompress_dataset(
    ds: xr.Dataset,
    compressor: Union[
        Codec, list[Codec], dict[str, Union[Codec, list[Codec]]]
    ],
) -> xr.Dataset:
    """Perform compression and decompression on the provided dataset
    to examine the effect of compression.

    Args:
        ds (xr.Dataset): _description_
        compressor (Union[
                Codec, list[Codec], dict[str, Union[Codec, list[Codec]]]
            ]): either a single compressor codec or stack of codecs that
            is applied to all variables, or a mapping from variable names
            to the codec or codes that are used to compress it.
            Note that compression is applied from left to right, i.e. the
            rightmost codec will be applied last. Decompression is applied
            in reverse.

    Returns:
        xr.Dataset: the reconstructed dataset
    """

    compressors = (
        compressor
        if isinstance(compressor, dict)
        else {var: compressor for var in ds}
    )

    data = {
        var: compress_decompress_dataarray_chunked(ds[var], compressor)
        for var, compressor in compressors.items()
    }

    return ds.copy(deep=False, data=data)


def summarise_dataarray(
    da: xr.DataArray,
    stat_dim: str = "stat",
    **kwargs,
) -> xr.DataArray:
    """Calculates several summary statistics over the provided data array.

    Args:
        da (xr.DataArray): _description_
        stat_dim (str): name of the new dimension that stores the statistics
        **kwargs: additional keyword arguments that are passed through to
            the reduction functions, e.g. `xr.DataArray.mean`.

    Returns:
        xr.DataArray: the new data array, with `stat_dim` dimension
    """

    reductions = {
        "mean": xr.DataArray.mean,
        "std": xr.DataArray.std,
        "var": xr.DataArray.var,
        "min": xr.DataArray.min,
        "max": xr.DataArray.max,
    }

    return xr.concat(
        [
            fn(da).expand_dims(dim={stat_dim: [key]}, axis=-1)
            for key, fn in reductions.items()
        ],
        dim=stat_dim,
    )


def plot_spatial_dataarray(
    da: xr.DataArray,
) -> Tuple[Figure, Axes]:
    if not is_gridded(da):
        raise NotImplementedError(
            "The loaded dataset is not gridded along the standard "
            "'latitude' and 'longitude' axes and regridding for "
            "plotting the dataset is not yet supported."
        )

    fig, ax = plt.subplots(1, 1, subplot_kw={"projection": ccrs.EqualEarth()})
    im = da.squeeze().plot.imshow(
        ax=ax, transform=ccrs.PlateCarree(), levels=10, add_colorbar=False
    )
    ax.coastlines()

    cbar_rect_left = ax.get_position().x1 + 0.02
    cbar_rect_bottom = ax.get_position().y0
    cbar_rect_width = 0.02
    cbar_rect_height = ax.get_position().height
    cax = fig.add_axes(
        [cbar_rect_left, cbar_rect_bottom, cbar_rect_width, cbar_rect_height]
    )
    plt.colorbar(im, cax=cax, label=f"{da.long_name} in {da.units}")

    return fig, ax
