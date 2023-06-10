import shutil
import uuid
from pathlib import Path
from typing import Optional
from urllib.parse import unquote as urlunquote
from urllib.parse import urlparse
from urllib.request import urlopen

import dask
import ipyfilite
import xarray as xr

dask.config.set(array__chunk_size="32MiB")


def open_dataset(path: Path, **kwargs) -> xr.Dataset:
    if path.suffix == ".grib" or kwargs.get("engine", None) == "cfgrib":
        # cfgrib creates index files right next to the data file,
        #  which may be in a read-only file system
        if "backend_kwargs" not in kwargs:
            kwargs["backend_kwargs"] = dict()
        if "indexpath" not in kwargs["backend_kwargs"]:
            kwargs["backend_kwargs"]["indexpath"] = ""

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


def download_small_http_file(url: str, name: Optional[str] = None) -> Path:
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
