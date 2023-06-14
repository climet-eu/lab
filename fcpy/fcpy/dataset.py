import shutil
import uuid
from contextlib import contextmanager
from pathlib import Path
from typing import Optional, Union
from urllib.parse import unquote as urlunquote
from urllib.parse import urlparse
from urllib.request import urlopen

import dask
import ipyfilite
import xarray as xr
import zarr
from numcodecs.abc import Codec

dask.config.set(array__chunk_size="32MiB")


def open_dataset(path: Path, **kwargs) -> xr.Dataset:
    if path.suffix == ".grib" or kwargs.get("engine", None) == "cfgrib":
        if "engine" not in kwargs:
            kwargs["engine"] = "cfgrib"
        if "backend_kwargs" not in kwargs:
            kwargs["backend_kwargs"] = dict()
        if "indexpath" not in kwargs["backend_kwargs"]:
            # cfgrib creates index files right next to the data file,
            #  which may be in a read-only file system
            kwargs["backend_kwargs"]["indexpath"] = ""

    if "".join(path.suffixes).endswith(".zarr.zip"):
        if "engine" not in kwargs:
            kwargs["engine"] = "zarr"

    if "chunks" not in kwargs:
        kwargs["chunks"] = "auto"

    if "cache" not in kwargs:
        kwargs["cache"] = False

    return xr.open_dataset(str(path), **kwargs)


async def mount_user_local_file() -> Path:
    uploader = ipyfilite.FileUploadLite()
    await uploader.request()
    uploader.close()

    return uploader.value[0].path


def mount_http_file(url: str, name: Optional[str] = None) -> Path:
    if name is None:
        name = _get_name_from_url(url)

    http_file = ipyfilite.HTTPFileIO(name=name, url=url)

    return http_file.path


def fetch_small_http_file(url: str, name: Optional[str] = None) -> Path:
    if name is None:
        name = _get_name_from_url(url)

    # FIXME: implement /scratch using the origin private file system with auto-cleanup
    small_path = Path("/scratch") / str(uuid.uuid4()) / name
    small_path.parent.mkdir(parents=True, exist_ok=False)

    with urlopen(url) as response:
        with small_path.open("wb") as file:
            shutil.copyfileobj(response, file)

    return small_path


def _get_name_from_url(url: str) -> str:
    return urlunquote(Path(urlparse(url).path).name)


def download_dataset_as_zarr(
    ds: xr.Dataset,
    name: str,
    compressor: Union[
        Codec, list[Codec], dict[str, Union[Codec, list[Codec]]]
    ],
    zip_compression: int = 0,
):
    name_suffix = "".join(Path(name).suffixes)

    # Ensure that the file path is easily recognisable as a zipped zarr file
    if name_suffix.endswith(".zarr.zip"):
        pass
    elif name_suffix.endswith(".zarr"):
        name = f"{name}.zip"
    elif name_suffix.endswith(".zip"):
        name = f"{Path(name).stem}.zarr.zip"
    else:
        name = f"{name}.zarr.zip"

    with ipyfilite.FileDownloadPathLite(name) as path:
        store = zarr.storage.ZipStore(
            str(path), compression=zip_compression, allowZip64=True, mode="x"
        )

        compressors = (
            compressor
            if isinstance(compressor, dict)
            else {var: compressor for var in ds}
        )

        encoding = dict()
        for var, compressor in compressors.items():
            if isinstance(compressor, list):
                if len(compressor) == 0:
                    continue
                encoding[var] = dict(
                    compressor=compressor[0],
                    filters=compressor[1:],
                )
            else:
                encoding[var] = dict(
                    compressor=compressor,
                    filters=[],
                )

        ds.to_zarr(store=store, mode="w-", encoding=encoding)

        store.close()


@contextmanager
def file_download_path(name: str) -> Path:
    try:
        with ipyfilite.FileDownloadPathLite(name) as path:
            yield path
    finally:
        pass
