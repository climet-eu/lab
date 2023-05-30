# (C) Copyright 2022 ECMWF.
#
# This software is licensed under the terms of the Apache Licence Version 2.0
# which can be obtained at http://www.apache.org/licenses/LICENSE-2.0.
# In applying this licence, ECMWF does not waive the privileges and immunities
# granted to it by virtue of its status as an intergovernmental organisation
# nor does it submit to any jurisdiction.
#

import itertools
import warnings
from collections import defaultdict
from collections.abc import Iterator
from time import time
from typing import Callable, Dict, Optional, Tuple, Type, Union

import cartopy.crs as ccrs
import fast_histogram
import ipywidgets as widgets
import matplotlib.pyplot as plt
import numpy as np
import scipy
import xarray as xr
from ipywidgets import fixed, interact
from tqdm import tqdm

from .compressors import Compressor
from .metrics import METRICS, Metric
from .utils import (
    STANDARD_NAME_LAT,
    STANDARD_NAME_LON,
    get_standard_name_dims,
    is_gridded,
)


def run_compressor_single(
    da: xr.DataArray, compressor: Compressor, bits: int
) -> xr.DataArray:
    # output: dims=[compressor, bits, existing dims...]
    compressed, params = compressor.compress(da.values, bits)
    decompressed = compressor.decompress(compressed, params)
    da2 = da.copy(data=decompressed)
    da2 = da2.expand_dims(compressor=[compressor.name], bits=[bits])
    return da2


def get_chunk_fn(da: xr.DataArray, chunk_dims: list[str]) -> Callable:
    other_dims = list(set(da.dims) - set(chunk_dims))
    other_coords = [da[dim].values for dim in other_dims]

    def chunk_fn(da: xr.DataArray) -> Iterator[xr.DataArray]:
        for sel in itertools.product(*other_coords):
            sel_dict = dict(zip(other_dims, sel))
            yield da.sel(**sel_dict).stack(dict(chunk=chunk_dims))

    return chunk_fn


def get_max_chunk_fn(
    da: xr.DataArray, max_chunk_size_bytes: Optional[int] = None
) -> Tuple[Callable, list[str]]:
    if max_chunk_size_bytes is None:
        max_chunk_size_bytes = 4 * 1024 * 1024 * 1024  # 4 GiB

    dim_sizes = da.sizes

    def get_chunk_size_bytes(dims: list[str]) -> int:
        dtype_size = np.dtype(da.dtype).itemsize
        return np.prod([dim_sizes[dim] for dim in dims]) * dtype_size

    # Start with all dimensions and gradually remove dimensions
    # until chunk size is within threshold.
    chunk_dims = list(da.dims)

    chunk_size_bytes = get_chunk_size_bytes(chunk_dims)
    while chunk_size_bytes > max_chunk_size_bytes:
        if len(chunk_dims) == 1:
            break
        chunk_dims.pop(0)
        chunk_size_bytes = get_chunk_size_bytes(chunk_dims)

    return get_chunk_fn(da, chunk_dims), chunk_dims


def get_field_dims(da: xr.DataArray) -> list[str]:
    if da.attrs.get("GRIB_gridType") == "reduced_gg":
        assert "values" in da.dims
        return ["values"]

    standard_names = get_standard_name_dims(da)
    if (
        STANDARD_NAME_LON in standard_names
        and STANDARD_NAME_LAT in standard_names
    ):
        return [
            standard_names[STANDARD_NAME_LAT],
            standard_names[STANDARD_NAME_LON],
        ]

    raise RuntimeError("Could not determine horizontal dimensions of field")


def get_field_chunk_fn(da: xr.DataArray) -> Callable:
    chunk_dims = get_field_dims(da)
    return get_chunk_fn(da, chunk_dims)


def compute_histograms_single_variable(
    da: xr.DataArray,
    baseline: Compressor,
    compressors: list[Compressor],
    metrics: list[Type[Metric]],
    bits: list[int],
    max_chunk_size_bytes: Optional[int] = None,
    max_chunk_fn: Optional[Callable] = None,
) -> Dict[str, Tuple[xr.DataArray, xr.DataArray]]:
    if baseline.bits is None:
        raise RuntimeError("bits parameter missing in baseline")

    # Error metrics can run over larger chunks as well,
    # therefore those two functions are separate.
    if max_chunk_fn is None:
        max_chunk_fn, max_chunk_dims = get_max_chunk_fn(
            da, max_chunk_size_bytes
        )
        if set(max_chunk_dims) != set(da.dims):
            warnings.warn(
                f"{da.name}: chunk dims adjusted to {max_chunk_dims}"
            )
        other_dims = set(da.dims) - set(max_chunk_dims)
        chunk_count = np.prod([da.sizes[dim] for dim in other_dims])
    else:
        # unknown
        chunk_count = None

    histogram_bins = 100

    src_histogram_freqs = xr.DataArray(
        np.nan,
        name=da.name,
        attrs=da.attrs,
        dims=["bin"],
        coords={
            "bin": np.arange(histogram_bins),
        },
    )

    src_histogram_edges = xr.DataArray(
        np.nan,
        name=da.name,
        attrs=da.attrs,
        dims=["bin_edge"],
        coords={
            "bin_edge": np.arange(histogram_bins + 1),
        },
    )

    baseline_histogram_freqs = src_histogram_freqs.copy()
    baseline_histogram_edges = src_histogram_edges.copy()

    decompressed_histogram_freqs = xr.DataArray(
        np.nan,
        name=da.name,
        attrs=da.attrs,
        dims=["compressor", "bits", "bin"],
        coords={
            "compressor": [c.name for c in compressors],
            "bits": bits,
            "bin": np.arange(histogram_bins),
        },
    )

    decompressed_histogram_edges = xr.DataArray(
        np.nan,
        name=da.name,
        attrs=da.attrs,
        dims=["compressor", "bits", "bin_edge"],
        coords={
            "compressor": [c.name for c in compressors],
            "bits": bits,
            "bin_edge": np.arange(histogram_bins + 1),
        },
    )

    metric_histogram_freqs = xr.DataArray(
        np.nan,
        name=da.name,
        attrs=da.attrs,
        dims=["compressor", "bits", "metric", "bin"],
        coords={
            "compressor": [c.name for c in compressors],
            "bits": bits,
            "metric": [m.name for m in metrics],
            "bin": np.arange(histogram_bins),
        },
    )

    metric_histogram_edges = xr.DataArray(
        np.nan,
        name=da.name,
        attrs=da.attrs,
        dims=["compressor", "bits", "metric", "bin_edge"],
        coords={
            "compressor": [c.name for c in compressors],
            "bits": bits,
            "metric": [m.name for m in metrics],
            "bin_edge": np.arange(histogram_bins + 1),
        },
    )

    t0 = time()
    for chunk in tqdm(max_chunk_fn(da), total=chunk_count):
        update_histogram(
            chunk.values,
            src_histogram_freqs,
            src_histogram_edges,
            log_prefix=f"{da.name} [histogram for source]: ",
        )

        da_baseline = run_compressor_single(chunk, baseline, baseline.bits)
        da_baseline = da_baseline.squeeze(dim=["compressor", "bits"])

        update_histogram(
            da_baseline.values,
            baseline_histogram_freqs,
            baseline_histogram_edges,
            log_prefix=f"{da.name} [histogram for baseline]: ",
        )

        for compressor in compressors:
            for bits_ in bits:
                da_decompressed = run_compressor_single(
                    chunk, compressor, bits_
                )

                idx = dict(
                    compressor=compressor.name,
                    bits=bits_,
                )

                freqs = decompressed_histogram_freqs.sel(idx)
                edges = decompressed_histogram_edges.sel(idx)
                update_histogram(
                    da_decompressed.values,
                    freqs,
                    edges,
                    log_prefix=(
                        f"{da.name} [histogram for decompressed:"
                        f" {compressor.name} @ {bits_} bits]: "
                    ),
                )

                for metric in metrics:
                    out = metric().compute(
                        da_baseline.values, da_decompressed.values
                    )

                    idx = dict(
                        compressor=compressor.name,
                        bits=bits_,
                        metric=metric.name,
                    )

                    freqs = metric_histogram_freqs.sel(idx)
                    edges = metric_histogram_edges.sel(idx)
                    update_histogram(
                        out,
                        freqs,
                        edges,
                        log_prefix=(
                            f"{da.name} [histogram for metric:"
                            f" {metric.name} for {compressor.name} @"
                            f" {bits_} bits]: "
                        ),
                    )

    print(f"{time()-t0} s")

    return {
        "source": (src_histogram_freqs, src_histogram_edges),
        "baseline": (baseline_histogram_freqs, baseline_histogram_edges),
        "decompressed": (
            decompressed_histogram_freqs,
            decompressed_histogram_edges,
        ),
        "metric": (metric_histogram_freqs, metric_histogram_edges),
    }


def update_histogram(
    data: np.ndarray, freqs: np.ndarray, edges: np.ndarray, log_prefix=""
):
    data = data.ravel()

    # mask infinity with nan to avoid min/max picking it up below
    data = data[np.isfinite(data)]
    if data.size == 0:
        print(f"{log_prefix}ignoring, data is all-nan/inf")
        return

    bins = len(edges) - 1
    is_first = np.isnan(edges[0].item())
    if is_first:
        hist_min, hist_max = (np.min(data), np.max(data))

        if hist_min == hist_max:
            old_hist_min = hist_min
            eps = np.finfo(data.dtype).eps
            hist_min = hist_min - eps * bins
            hist_max = hist_max + eps * bins
            print(
                f"{log_prefix}"
                f"metric values min/max are identical ({old_hist_min}), "
                f"using [{hist_min}, {hist_max}] as histogram range"
            )
        edges[:] = np.linspace(hist_min, hist_max, bins + 1)
        hist_range = edges[0], edges[-1]
        freqs[:] = fast_histogram.histogram1d(
            data, bins=bins, range=hist_range
        )
    else:
        hist_min, hist_max = edges[0].item(), edges[-1].item()

        # check if min/max of all following chunks is roughly
        # the same as the initial min/max, else print a warning
        current_min, current_max = (np.min(data), np.max(data))
        eps_factor = 0.01
        eps = np.finfo(data.dtype).eps
        eps_min = max(eps, abs(eps_factor * hist_min))
        eps_max = max(eps, abs(eps_factor * hist_max))
        if (
            current_min < hist_min - eps_min
            or current_max > hist_max + eps_max
        ):
            print(
                f"{log_prefix}min/max of chunk is outside range by"
                f" >{eps_factor*100}%, histogram may be off (initial:"
                f" [{hist_min}, {hist_max}], current: [{current_min},"
                f" {current_max}])"
            )

        if hist_min != hist_max:
            hist_range = (hist_min, hist_max)
            freqs += fast_histogram.histogram1d(
                data, bins=bins, range=hist_range
            )


def compute_histograms(
    ds: xr.Dataset,
    baseline: Compressor,
    compressors: list[Compressor],
    metrics: list[Type[Metric]],
    bits: dict[str, list[int]] = None,
    max_chunk_size_bytes: Optional[int] = None,
) -> Dict[str, Tuple[xr.Dataset, xr.Dataset]]:
    histogram_frequencies = defaultdict(list)
    histogram_edges = defaultdict(list)
    for var_name in ds:
        da = ds[var_name]
        histograms = compute_histograms_single_variable(
            da,
            baseline,
            compressors,
            metrics,
            bits=bits[var_name],
            max_chunk_size_bytes=max_chunk_size_bytes,
        )
        for hist_type, (freqs, edges) in histograms.items():
            histogram_frequencies[hist_type].append(freqs)
            histogram_edges[hist_type].append(edges)
    out = {}
    for hist_type in histogram_frequencies.keys():
        out[hist_type] = (
            xr.merge(histogram_frequencies[hist_type], combine_attrs="drop"),
            xr.merge(histogram_edges[hist_type], combine_attrs="drop"),
        )
    return out


def compute_stats(
    freqs: xr.Dataset,
    bins: xr.Dataset,
    var_names: Optional[list[str]] = None,
    compressors: Optional[list[str]] = None,
    metrics: Optional[list[str]] = None,
    bits: Optional[list[str]] = None,
) -> xr.Dataset:
    reductions = {
        "median": lambda dist: dist.median(),
        "mean": lambda dist: dist.mean(),
        "std": lambda dist: dist.std(),
        "var": lambda dist: dist.var(),
        "q1": lambda dist: dist.ppf([0.25])[0],
        "q3": lambda dist: dist.ppf([0.75])[0],
        # Compute the minimum and maximum over the edges of the histogram
        "min": lambda dist: min(dist.ppf([0])[0], dist.ppf([1])[0]),
        "max": lambda dist: max(dist.ppf([0])[0], dist.ppf([1])[0]),
    }
    if var_names is None:
        var_names = list(freqs)
    if compressors is None:
        compressors = freqs.compressor.values
    if metrics is None:
        metrics = freqs.metric.values
    if bits is None:
        bits = freqs.bits.values

    arr = []
    for var_name in var_names:
        stats = xr.DataArray(
            np.nan,
            name=var_name,
            dims=["compressor", "bits", "metric", "reduction"],
            coords={
                "compressor": compressors,
                "bits": bits,
                "metric": metrics,
                "reduction": list(reductions.keys()),
            },
        )
        for compressor in compressors:
            for bits_ in bits:
                for metric in metrics:
                    idx = {
                        "compressor": compressor,
                        "bits": bits_,
                        "metric": metric,
                    }
                    hist = (freqs[var_name].loc[idx], bins[var_name].loc[idx])
                    hist_dist = scipy.stats.rv_histogram(hist)
                    stats.loc[idx] = [
                        fn(hist_dist) for fn in reductions.values()
                    ]

        arr.append(stats)

    out = xr.merge(arr)
    return out


def compute_decompressed_stats(
    reference_freqs: xr.Dataset,
    reference_bins: xr.Dataset,
    decompressed_freqs: xr.Dataset,
    decompressed_bins: xr.Dataset,
    var_names: Optional[list[str]] = None,
    compressors: Optional[list[str]] = None,
    bits: Optional[list[str]] = None,
) -> xr.Dataset:
    reductions = {
        "snr": (
            lambda reference_dist, decompressed_dist: reference_dist.var()
            / decompressed_dist.var()
        ),
    }
    if var_names is None:
        var_names = list(decompressed_freqs)
    if compressors is None:
        compressors = decompressed_freqs.compressor.values
    if bits is None:
        bits = decompressed_freqs.bits.values

    arr = []
    for var_name in var_names:
        stats = xr.DataArray(
            np.nan,
            name=var_name,
            dims=["compressor", "bits", "reduction"],
            coords={
                "compressor": compressors,
                "bits": bits,
                "reduction": list(reductions.keys()),
            },
        )

        baseline_hist = (reference_freqs[var_name], reference_bins[var_name])
        baseline_hist_dist = scipy.stats.rv_histogram(baseline_hist)

        for compressor in compressors:
            for bits_ in bits:
                idx = {"compressor": compressor, "bits": bits_}
                decompressed_hist = (
                    decompressed_freqs[var_name].loc[idx],
                    decompressed_bins[var_name].loc[idx],
                )
                decompressed_hist_dist = scipy.stats.rv_histogram(
                    decompressed_hist
                )
                stats.loc[idx] = [
                    fn(baseline_hist_dist, decompressed_hist_dist)
                    for fn in reductions.values()
                ]

        arr.append(stats)

    out = xr.merge(arr)
    return out


def compute_stats_direct(
    ds: xr.Dataset,
    baseline: Compressor,
    compressors: list[Compressor],
    metrics: list[Type[Metric]],
    bits: dict[str, list[int]],
):
    das = []
    for var_name in ds:
        da = ds[var_name]
        das.append(
            compute_stats_direct_single_variable(
                da, baseline, compressors, metrics, bits[var_name]
            )
        )
    return xr.merge(das)


def compute_stats_direct_single_variable(
    da: xr.DataArray,
    baseline: Compressor,
    compressors: list[Compressor],
    metrics: list[Type[Metric]],
    bits: list[str],
):
    reductions = {
        "median": lambda d: np.median(d),
        "mean": lambda d: d.mean(),
        "std": lambda d: d.std(),
        "var": lambda d: d.var(),
        "q1": lambda d: np.quantile(d, 0.25),
        "q3": lambda d: np.quantile(d, 0.75),
        "min": lambda d: d.min(),
        "max": lambda d: d.max(),
    }
    stats = xr.DataArray(
        np.nan,
        name=da.name,
        dims=["compressor", "bits", "metric", "reduction"],
        coords={
            "compressor": [c.name for c in compressors],
            "bits": bits,
            "metric": [m.name for m in metrics],
            "reduction": list(reductions.keys()),
        },
    )

    da_baseline = run_compressor_single(da, baseline, baseline.bits)
    da_baseline = da_baseline.squeeze(dim=["compressor", "bits"])

    for compressor in compressors:
        for bits_ in bits:
            da_decompressed = run_compressor_single(da, compressor, bits_)

            for metric in metrics:
                out = metric().compute(
                    da_baseline.values, da_decompressed.values
                )

                for reduction, fn in reductions.items():
                    idx = dict(
                        compressor=compressor.name,
                        bits=bits_,
                        metric=metric.name,
                        reduction=reduction,
                    )
                    stats.loc[idx] = fn(out)
    return stats


def compute_custom_metrics(
    ds: xr.Dataset,
    baseline: Compressor,
    compressors: list[Compressor],
    custom_metrics: list[Callable],
    bits: dict[str, list[int]],
    max_chunk_size_bytes: Optional[int],
) -> list[xr.Dataset]:
    das_metric = defaultdict(list)
    for var_name in ds:
        da = ds[var_name]
        bits_ = bits[var_name]
        max_chunk_fn, max_chunk_dims = get_max_chunk_fn(
            da, max_chunk_size_bytes
        )
        for i, fn in enumerate(custom_metrics):
            chunks = max_chunk_fn(da)
            da_metric = fn(chunks, baseline, compressors, bits_)
            da_metric.name = var_name
            das_metric[i].append(da_metric)
    out = [xr.merge(das_metric[i]) for i in das_metric]
    return out


class Suite:
    """Create a suite.

    Args:
        ds (xr.Dataset): The dataset to use.
        baseline (Compressor): The compressor to use for the baseline.
            Must include bits in the constructor.
        compressors (list[Compressor]): The list of compressors to use.
        metrics (list[Type[Metric]]): The list of metrics to compute.
        custom_metrics (list[Callable], optional): Custom metrics as user
            functions. Each function is called as
            `fn(chunks, baseline, compressors, bits)`
            and must return an xarray DataArray.
        bits (list[int], optional): List of bits values to iterate over.
            Defaults to Klöwer et al. (2021)'s bit-information metric.
        max_chunk_size_bytes (int, optional): Maximum size in bytes that a
            chunk may have. Defaults to 4 GiB.
        skip_histograms (bool, optional): If True, compute metrics directly
            instead of using histograms.
    """

    def __init__(
        self,
        ds: xr.Dataset,
        baseline: Compressor,
        compressors: list[Compressor],
        metrics: list[Type[Metric]],
        custom_metrics: Optional[list[Callable]] = None,
        bits: Optional[Union[dict, list[int]]] = None,
        max_chunk_size_bytes: Optional[int] = None,
        skip_histograms=False,
    ):
        if bits is None:
            raise NotImplementedError(
                "Computing the required bits is not yet supported, please"
                " provide `bits` explicitly"
            )
        elif isinstance(bits, list):
            bits_per_var = {var_name: bits for var_name in ds}
        elif isinstance(bits, dict):
            bits_per_var = bits
        else:
            raise ValueError("bits must be a list or dict")

        self.ds = ds
        self.baseline = baseline
        self.metrics = metrics
        self.bits = bits_per_var
        if skip_histograms:
            self.histograms = None
            self.stats = compute_stats_direct(
                ds,
                baseline,
                compressors,
                metrics,
                bits=bits_per_var,
            )
        else:
            self.stats = None
            self.histograms = compute_histograms(
                ds,
                baseline,
                compressors,
                metrics,
                bits=bits_per_var,
                max_chunk_size_bytes=max_chunk_size_bytes,
            )

        if custom_metrics is None:
            self.custom_metrics = []
        else:
            self.custom_metrics = compute_custom_metrics(
                ds,
                baseline,
                compressors,
                custom_metrics,
                bits=bits_per_var,
                max_chunk_size_bytes=max_chunk_size_bytes,
            )

    def snr(self, reference: str = "baseline"):
        # TODO doesn't work without histograms yet
        assert reference in ["source", "baseline"]
        freqs_reference, edges_reference = self.histograms[reference]
        freqs_decompressed, edges_decompressed = self.histograms[
            "decompressed"
        ]

        stats = compute_decompressed_stats(
            freqs_reference,
            edges_reference,
            freqs_decompressed,
            edges_decompressed,
        )
        return stats.sel(reduction="snr")

    def compute_metric_stats(
        self,
        var_names: Optional[list[str]] = None,
        metrics: Optional[list[str]] = None,
        compressors: Optional[list[str]] = None,
        bits: Optional[list[int]] = None,
    ):
        if self.histograms:
            freqs, edges = self.histograms["metric"]

            stats = compute_stats(
                freqs,
                edges,
                var_names=var_names,
                metrics=metrics,
                compressors=compressors,
                bits=bits,
            )
        else:
            stats = self.stats
            if var_names is not None:
                stats = stats[var_names]
            if metrics is not None:
                stats = stats.sel(metric=metrics)
            if compressors is not None:
                stats = stats.sel(compressor=compressors)
            if bits is not None:
                stats = stats.sel(bits=bits)

        return stats

    def lineplot(
        self,
        metric: Type[Metric],
        reduction: str,
        var_names: Optional[list[str]] = None,
    ):
        if var_names is None:
            var_names = list(self.ds)
        else:
            var_names = list(var_names)
        if len(var_names) == 0:
            return

        stats = self.compute_metric_stats(
            var_names=var_names,
            metrics=[metric.name],
        )

        # TODO: add choose colorscheme
        from cycler import cycler

        colorlist = ["#648FFF", "#785EF0", "#DC267F", "k"]
        custom_cycler = cycler(color=colorlist)

        for var_name in var_names:
            fig, ax = plt.subplots()
            ax.set_prop_cycle(custom_cycler)
            vals = stats[var_name].sel(metric=metric.name, reduction=reduction)
            vals.plot.line(x="bits", hue="compressor", ax=ax)
            new_list = range(
                int(np.floor(vals.bits.min())),
                int(np.ceil(vals.bits.max())) + 1,
            )
            ax.set_xticks(new_list)
            ax.set_xlabel("Number of bits")
            # TODO: fix units
            ax.set_ylabel(
                f"{self.ds[var_name].long_name} {metric.name} in"
                f" {self.ds[var_name].units}"
            )

            text_offset = 0.05
            ax.axvline(x=16, color="k", linewidth=2)
            ax.text(
                16 + text_offset, vals.min(), "Current @ 16 bits", rotation=90
            )

            fig.show()

    def histplot(
        self,
        metric: Type[Metric],
        compressor: Compressor,
        bits: int,
        var_names: Optional[list[str]] = None,
    ):
        freqs, edges = self.histograms["metric"]
        freqs_sel = freqs.sel(
            metric=metric.name, compressor=compressor, bits=bits
        )
        bins_sel = edges.sel(
            metric=metric.name, compressor=compressor, bits=bits
        )

        if var_names is None:
            var_names = list(self.ds)
        if len(var_names) == 0:
            return
        for var_name in var_names:
            _, ax = plt.subplots()
            plt.stairs(
                freqs_sel[var_name].values,
                bins_sel[var_name].values,
                fill=True,
            )
            # TODO: fix units
            ax.set_xlabel(
                f"{self.ds[var_name].long_name} {metric.name} in"
                f" {self.ds[var_name].units}"
            )
            ax.set_ylabel("Frequency")
            ax.set_title(f"Compressor: {compressor}, Bits: {bits}")
            plt.show()

    def boxplot(
        self,
        metric: Type[Metric],
        compressor: str,
        bits: int,
        var_names: Optional[list[str]] = None,
    ):
        stats = self.compute_metric_stats(
            compressors=[compressor],
            metrics=[metric.name],
            bits=[bits],
        )

        if var_names is None:
            var_names = list(self.ds)
        if len(var_names) == 0:
            return
        for var_name in var_names:
            s = stats[var_name].squeeze()
            bxpstats = dict(
                med=s.sel(reduction="median").item(),
                q1=s.sel(reduction="q1").item(),
                q3=s.sel(reduction="q3").item(),
                whislo=s.sel(reduction="min").item(),
                whishi=s.sel(reduction="max").item(),
                label=f"{self.ds[var_name].long_name}",
            )

            _, ax = plt.subplots()
            ax.bxp([bxpstats], showfliers=False)
            # TODO: fix units
            ax.set_ylabel(
                f"{metric.name.capitalize()} in {self.ds[var_name].units}"
            )
            ax.set_title(f"Compressor: {compressor}, Bits: {bits}")

    def nblineplot(self):
        metric = [(m.name, m) for m in self.metrics]
        reduction = ["max", "min", "mean", "std"]
        var_names_all = list(self.ds.keys())
        var_names = widgets.SelectMultiple(
            options=var_names_all,
            value=[var_names_all[0]],
            description="Variables",
        )
        interact(
            self.lineplot,
            metric=metric,
            reduction=reduction,
            var_names=var_names,
        )


def plot_spatial_single(da, ds, var_name, metric):
    fig, ax = plt.subplots(1, 1, subplot_kw={"projection": ccrs.EqualEarth()})
    regridded = da.squeeze()
    im = regridded.plot.imshow(
        ax=ax, transform=ccrs.PlateCarree(), levels=10, add_colorbar=False
    )
    ax.set_title("")
    ax.coastlines()
    cbar_rect_left = ax.get_position().x1 + 0.02
    cbar_rect_bottom = ax.get_position().y0
    cbar_rect_width = 0.02
    cbar_rect_height = ax.get_position().height
    cax = fig.add_axes(
        [cbar_rect_left, cbar_rect_bottom, cbar_rect_width, cbar_rect_height]
    )
    plt.colorbar(
        im, cax=cax, label=f"{ds[var_name].long_name} in {ds[var_name].units}"
    )
    ax.set_title(f"{metric.capitalize()}")
    plt.show()


def spatialplot(
    ds: xr.Dataset,
    baseline: Compressor,
    var_name: str,
    compressor: Compressor,
    metric: Type[Metric],
    latitude: float,
    longitude: float,
    third_dim: Optional[str] = None,
    **sel: dict,
):
    standard_names = get_standard_name_dims(ds)
    is_ds_gridded = is_gridded(ds)

    plot_sel = {}
    if third_dim and third_dim in sel:
        plot_sel[third_dim] = sel.pop(third_dim)

    da_sel = ds[var_name].sel(sel)

    assert baseline.bits is not None
    assert compressor.bits is not None
    da_baseline = run_compressor_single(da_sel, baseline, baseline.bits)
    da_baseline = da_baseline.squeeze(dim=["compressor", "bits"])
    da_decompressed = run_compressor_single(
        da_sel, compressor, compressor.bits
    )

    da = metric().compute(da_baseline, da_decompressed)
    da.attrs = {
        "long_name": da_sel.attrs["long_name"],
        "units": da_sel.attrs["units"],
    }

    if third_dim not in da.dims:
        third_dim = None

    das = [da, da_baseline, da_decompressed]
    das_regridded = []
    for da_ in das:
        if is_ds_gridded:
            das_regridded.append(da_)
        else:
            raise NotImplementedError(
                "The loaded dataset is not gridded along the standard "
                "'latitude' and 'longitude' axes and regridding for "
                "plotting the dataset is not yet supported."
            )

    da, da_baseline, da_decompressed = das_regridded

    plot_spatial_single(
        da_baseline.sel({third_dim: plot_sel[third_dim]}),
        ds,
        var_name,
        metric="Baseline",
    )
    plot_spatial_single(
        da_decompressed.sel({third_dim: plot_sel[third_dim]}),
        ds,
        var_name,
        metric="Decompressed",
    )
    plot_spatial_single(
        da.sel({third_dim: plot_sel[third_dim]}),
        ds,
        var_name,
        metric=metric.name,
    )

    if third_dim:
        fig, ax = plt.subplots(
            nrows=1, ncols=3, figsize=(25, 5), width_ratios=[2, 2, 1]
        )
        # First column: lat/third dim slice
        im = da.sel(
            {standard_names["longitude"]: longitude}, method="nearest"
        ).plot(ax=ax[0], add_colorbar=False)
        plt.colorbar(im, ax=ax[0]).set_label(
            label=(
                f"{ds[var_name].long_name} {metric.name} in"
                f" {ds[var_name].units}"
            )
        )
        # Second column: lon/third dim slice
        im = da.sel(
            {standard_names["latitude"]: latitude}, method="nearest"
        ).plot(ax=ax[1], add_colorbar=False)
        plt.colorbar(im, ax=ax[1]).set_label(
            label=(
                f"{ds[var_name].long_name} {metric.name} in"
                f" {ds[var_name].units}"
            )
        )
        # Third column: third dim profile
        im = da.sel(
            {
                standard_names["longitude"]: longitude,
                standard_names["latitude"]: latitude,
            },
            method="nearest",
        ).plot(y=third_dim, ax=ax[2])
        ax[2].set_xlabel(
            f"{ds[var_name].long_name} {metric.name} in {ds[var_name].units}"
        )
        fig.tight_layout()
    plt.show()


def nbspatialplot(
    ds: xr.Dataset,
    baseline: Compressor,
    compressor: Compressor,
    third_dim=None,
):
    var_name = list(ds)
    metric = [(m.name, m) for m in METRICS]

    standard_names = get_standard_name_dims(ds)
    dims_to_exclude = set(["values"])

    for name in [STANDARD_NAME_LAT, STANDARD_NAME_LON]:
        if name in standard_names:
            dims_to_exclude.add(standard_names[name])

    dims = set(ds.dims) - dims_to_exclude
    sel = {dim: ds[dim].values for dim in dims if ds.dims[dim] > 1}
    if third_dim:
        sel[third_dim] = widgets.SelectionSlider(options=ds[third_dim].values)
    latitude = widgets.IntSlider(min=-90, max=90, step=1, value=0)
    longitude = widgets.IntSlider(min=-180, max=180, step=1, value=0)

    interact(
        spatialplot,
        ds=fixed(ds),
        baseline=fixed(baseline),
        compressor=fixed(compressor),
        metric=metric,
        var_name=var_name,
        latitude=latitude,
        longitude=longitude,
        third_dim=fixed(third_dim),
        **sel,
    )
