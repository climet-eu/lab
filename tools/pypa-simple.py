import json
import re
import shutil
from pathlib import Path

lock_path = Path("pyodide") / "dist" / "pyodide-lock.json"
pypa_path = Path("pypa") / "simple"

if pypa_path.exists():
    shutil.rmtree(pypa_path)
pypa_path.mkdir(parents=True, exist_ok=True)

with lock_path.open("rb") as f:
    lock = json.load(f)

packages = dict()

PACKAGE_PYPI_NAME_FIXES = {
    "fiona": "fiona",  # no-op, otherwise a false positive
    "Jinja2": "Jinja2",  # no-op, otherwise a false positive
    "markdown": "Markdown",
    "netcdf4": "netCDF4",
    "Pillow": "pillow",
    "pint": "Pint",
    "Pygments": "Pygments",  # no-op, otherwise a false positive
    "pyyaml": "PyYAML",
    "shapely": "shapely",  # no-op, otherwise a false positive
    "Webob": "WebOb",
}

for package in lock["packages"].values():
    if package["package_type"] != "package":
        continue
    if Path(package["file_name"]).suffix != ".whl":
        continue
    if package["install_dir"] != "site":
        continue

    name = PACKAGE_PYPI_NAME_FIXES.get(package["name"], package["name"])
    packages[name] = dict(filename=package["file_name"], sha256=package["sha256"])

with (pypa_path / "index.json").open("w") as f:
    json.dump({
        "meta": {
            "api-version": "1.0",
        },
        "projects": [
            { "name": name } for name in packages.keys()
        ],
    }, f)

for name, package in packages.items():
    normalized_name = re.sub(r"[-_.]+", "-", name).lower()

    (pypa_path / normalized_name).mkdir(parents=True, exist_ok=True)

    with (pypa_path / normalized_name / "index.json").open("w") as f:
        json.dump({
            "meta": {
                "api-version": "1.0",
            },
            "name": normalized_name,
            "files": [
                {
                    "filename": package["filename"],
                    # from /pypa/simple/<project>/
                    # to /static/pyodide/<filename>
                    "url": f"../../../static/pyodide/{package['filename']}",
                    "hashes": { "sha256": package["sha256"] },
                    "dist-info-metadata": True,
                }
            ],
        }, f)
