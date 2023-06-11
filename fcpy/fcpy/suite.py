# (C) Copyright 2022 ECMWF.
#
# This software is licensed under the terms of the Apache Licence Version 2.0
# which can be obtained at http://www.apache.org/licenses/LICENSE-2.0.
# In applying this licence, ECMWF does not waive the privileges and immunities
# granted to it by virtue of its status as an intergovernmental organisation
# nor does it submit to any jurisdiction.
#

from collections import defaultdict
from contextlib import contextmanager
from time import perf_counter
from typing import Tuple, Union

import cartopy.crs as ccrs
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import xarray as xr
from matplotlib.axes import Axes
from matplotlib.figure import Figure
from numcodecs.abc import Codec
from numcodecs.compat import ensure_contiguous_ndarray_like

from .utils import is_gridded


def compress_decompress_dataarray_single_chunk(
    da: xr.DataArray,
    compressor: Union[Codec, list[Codec]],
    experiment: str = "<global>",
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
        experiment (str): name of the compression experiment under which the
            compression statistics are collected.

    Returns:
        xr.DataArray: the reconstructed data array
    """
    if da.size == 0:
        # Compressing and decompressing preserves the input shape
        return da.copy(deep=False).chunk([-1] * len(da.shape))

    compressors = compressor if isinstance(compressor, list) else [compressor]

    raw_bytes = [0 for c in compressors]
    enc_bytes = [0 for c in compressors]
    enc_time = [0.0 for c in compressors]
    dec_time = [0.0 for c in compressors]

    encoded = np.ascontiguousarray(da.values)

    silhouettes = []

    for i, c in enumerate(compressors):
        silhouettes.append((encoded.shape, encoded.dtype))

        raw_bytes[i] += encoded.nbytes
        start = perf_counter()

        encoded = ensure_contiguous_ndarray_like(c.encode(encoded))

        end = perf_counter()
        enc_bytes[i] += encoded.nbytes
        enc_time[i] += end - start

    decoded = encoded

    for i, d in list(enumerate(compressors))[::-1]:
        shape, dtype = silhouettes.pop()
        out = np.empty(shape=shape, dtype=dtype)

        start = perf_counter()

        decoded = d.decode(decoded, out).reshape(shape)

        end = perf_counter()
        dec_time[i] += end - start

    scope = next(iter(getattr(measure_compression_stats, "_scopes", [])), None)
    if scope is not None:
        for i, c in enumerate(compressors):
            scope["raw_bytes"][(experiment, str(c))] += raw_bytes[i]
            scope["enc_bytes"][(experiment, str(c))] += enc_bytes[i]
            scope["enc_time"][(experiment, str(c))] += enc_time[i]
            scope["dec_time"][(experiment, str(c))] += dec_time[i]

    return da.copy(deep=False, data=decoded).chunk([-1] * len(da.shape))


def compress_decompress_dataarray_chunked(
    da: xr.DataArray,
    compressor: Union[Codec, list[Codec]],
    experiment: str = "<global>",
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
        experiment (str): name of the compression experiment under which the
            compression statistics are collected.

    Returns:
        xr.DataArray: the reconstructed data array
    """

    # Encoding and decoding must be run together as xr.map_blocks is still *very* brittle
    return xr.map_blocks(
        compress_decompress_dataarray_single_chunk,
        da,
        kwargs=dict(compressor=compressor, experiment=experiment),
    )


def compress_decompress_dataset(
    ds: xr.Dataset,
    compressor: Union[
        Codec, list[Codec], dict[str, Union[Codec, list[Codec]]]
    ],
    experiment: Union[str, dict[str, str]] = "<global-{}>",
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
        experiment (Union[str, dict[str, str]]): either the name of the
            compression experiment that specialised for all variables, or a
            mapping from variable names to experiment names under which the
            compression statistics are collected.

    Returns:
        xr.Dataset: the reconstructed dataset
    """

    compressors = (
        compressor
        if isinstance(compressor, dict)
        else {var: compressor for var in ds}
    )
    experiments = (
        experiment
        if isinstance(experiment, dict)
        else {var: experiment.format(var) for var in ds}
    )

    data = {
        var: compress_decompress_dataarray_chunked(
            ds[var], compressor=compressor, experiment=experiments[var]
        )
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
    subplot_kw: dict = {"projection": ccrs.EqualEarth()},
    transform: ccrs.Projection = ccrs.PlateCarree(),
    imshow_kw: dict = dict(),
) -> Tuple[Figure, Axes]:
    if not is_gridded(da):
        raise NotImplementedError(
            "The loaded dataset is not gridded along the standard "
            "'latitude' and 'longitude' axes and regridding for "
            "plotting the dataset is not yet supported."
        )

    fig, ax = plt.subplots(1, 1, subplot_kw=subplot_kw)
    im = da.squeeze().plot.imshow(
        ax=ax,
        transform=transform,
        add_colorbar=False,
        **imshow_kw,
    )
    ax.coastlines()

    cbar_rect_left = ax.get_position().x1 + 0.02
    cbar_rect_bottom = ax.get_position().y0
    cbar_rect_width = 0.02
    cbar_rect_height = ax.get_position().height
    cax = fig.add_axes(
        [cbar_rect_left, cbar_rect_bottom, cbar_rect_width, cbar_rect_height]
    )

    label = getattr(da, "long_name", None) or da.name
    if getattr(da, "units", None):
        label = f"{label} [{da.units}]"
    plt.colorbar(im, cax=cax, label=label)

    return fig, ax


@contextmanager
def measure_compression_stats(display=True):
    stats = pd.DataFrame(
        {
            "Experiment": [],
            "Codec": [],
            "compression ratio [raw B / enc B]": [],
            "encode throughput [raw GB/s]": [],
            "decode throughput [enc GB/s]": [],
        }
    ).set_index(["Experiment", "Codec"])

    if getattr(measure_compression_stats, "_scopes", None) is None:
        measure_compression_stats._scopes = []

    measure_compression_stats._scopes.append(
        {
            "raw_bytes": defaultdict(int),
            "enc_bytes": defaultdict(int),
            "enc_time": defaultdict(float),
            "dec_time": defaultdict(float),
        }
    )

    try:
        yield stats
    finally:
        scope = measure_compression_stats._scopes.pop()

        keys = set(scope["raw_bytes"].keys())
        keys.intersection_update(scope["enc_bytes"].keys())
        keys.intersection_update(scope["enc_time"].keys())
        keys.intersection_update(scope["dec_time"].keys())

        for experiment, codec in sorted(keys):
            raw_bytes = scope["raw_bytes"][(experiment, codec)]
            enc_bytes = scope["enc_bytes"][(experiment, codec)]
            enc_time = scope["enc_time"][(experiment, codec)]
            dec_time = scope["dec_time"][(experiment, codec)]

            stats.loc[(experiment, codec), :] = [
                raw_bytes / enc_bytes,
                raw_bytes / enc_time / 1e9 if enc_time > 0.0 else float("inf"),
                enc_bytes / dec_time / 1e9 if dec_time > 0.0 else float("inf"),
            ]
