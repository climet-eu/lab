import json
import sys
from pathlib import Path

lock_path = Path("pyodide") / "dist" / "pyodide-lock.json"
requirements_path = Path("files") / "requirements.txt"

with lock_path.open("rb") as f:
    lock = json.load(f)

python = lock["info"]["python"]
pyodide = lock["info"]["version"]

packages = dict()

IGNORE_PACKAGES = [
    "git2",  # not a real package, experiment-in-progress
    "jupyterlite-preload",  # climet-eu/lab implementation detail
    "matplotlib-pyodide",  # pyodide implementation detail
    "micropip",  # pyodide implementation detail
    "pyodide-http",  # pyodide implementation detail
    "widgetsnbextension",  # JupyterLite mock with fake version
]

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
}

for package in lock["packages"].values():
    if package["package_type"] != "package":
        continue
    if Path(package["file_name"]).suffix != ".whl":
        continue
    if package["install_dir"] != "site":
        continue

    if package["name"] in IGNORE_PACKAGES:
        continue

    name = PACKAGE_PYPI_NAME_FIXES.get(package["name"], package["name"])

    # check for packages whose name guess might be wrong
    name_guess = package["file_name"].split("-")[0]
    if name_guess != package["name"].replace("-", "_"):
        if package["name"] not in PACKAGE_PYPI_NAME_FIXES:
            print(
                f"Suspicious package name {package['name']} with filename {name_guess}",
                file=sys.stderr,
            )

    packages[name] = package["version"]

with requirements_path.open("w") as f:
    f.write(
        "# "
        + " Online Laboratory for Climate Science and Meteorology ".center(76, "=")
        + " #\n"
    )
    f.write("# " + " requirements.txt (automatically generated) ".center(76) + " #\n")
    f.write("# " + "".center(76) + " #\n")
    f.write(
        "# "
        + " Please note that this list is currently only an approximation ".center(76)
        + " #\n"
    )
    f.write(
        "# "
        + " and does not include e.g. shared library dependencies ".center(76)
        + " #\n"
    )
    f.write("# " + "".center(76, "=") + " #\n")
    f.write("\n")
    f.write(f"# python == {python}\n")
    f.write(f"# pyodide == {pyodide}\n")
    f.write("\n")

    for name, version in sorted(packages.items(), key=lambda kv: kv[0].lower()):
        f.write(f"{name} == {version}\n")
