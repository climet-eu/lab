import json
import yaml
from dataclasses import dataclass
from pathlib import Path

lock_path = Path("pyodide") / "dist" / "pyodide-lock.json"
recipes_path = Path("pyodide") / "packages"

requirements_path = Path("venv") / "requirements.txt"
requirements_in_path = Path("venv") / "requirements.in"
constraints_path = Path("venv") / "constraints.txt"


@dataclass
class Package:
    version: str
    is_pure: bool


with lock_path.open("r") as f:
    lock = json.load(f)

python = lock["info"]["python"]
pyodide = lock["info"]["version"]

packages: dict[str, Package] = dict()

IGNORE_PACKAGES = {
    "git2",  # not a real package, experiment-in-progress
    "jupyterlite-cors",  # climet-eu/lab implementation detail
    "jupyterlite-preload",  # climet-eu/lab implementation detail
    "matplotlib-pyodide",  # pyodide implementation detail
    "micropip",  # pyodide implementation detail
    "pyodide-http",  # pyodide implementation detail
    "widgetsnbextension",  # JupyterLite mock with fake version
}

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

suspicious_packages = []

for package in lock["packages"].values():
    if package["package_type"] != "package":
        continue
    if Path(package["file_name"]).suffix != ".whl":
        continue
    if package["install_dir"] != "site":
        continue

    if package["name"] in IGNORE_PACKAGES:
        continue

    is_pure = False

    recipe_path = recipes_path / package["name"] / "meta.yaml"

    if recipe_path.exists():
        with recipe_path.open() as f:
            recipe = yaml.load(f, yaml.SafeLoader)

        try:
            url = recipe["source"]["url"]
        except KeyError:
            url = None

        if (
            url is not None
            and url.startswith("https://files.pythonhosted.org/packages")
            and url.endswith("none-any.whl")
            and package["name"] != "micropip"
        ):
            is_pure = True
    else:
        assert package["file_name"].startswith(
            "https://files.pythonhosted.org/packages"
        ) and package["file_name"].endswith("none-any.whl"), (
            f"{package['name']} has no recipe but isn't a pure Package"
        )

        is_pure = True

    name = PACKAGE_PYPI_NAME_FIXES.get(package["name"], package["name"])

    # check for packages whose name guess might be wrong
    name_guess = package["file_name"].split("-")[0]
    if name_guess != package["name"].replace("-", "_"):
        if package["name"] not in PACKAGE_PYPI_NAME_FIXES:
            suspicious_packages.append((package["name"], name_guess))

    packages[name] = Package(version=package["version"], is_pure=is_pure)

with (
    requirements_path.open("w") as req,
    requirements_in_path.open("w") as reqin,
    constraints_path.open("w") as con,
):

    def write(s: str, *to) -> None:
        if len(to) == 0:
            to = (req, reqin, con)
        for t in to:
            t.write(s)

    write(
        "# "
        + " Online Laboratory for Climate Science and Meteorology ".center(76, "=")
        + " #\n"
    )
    write("# " + "".center(76) + " #\n")

    req.write("# " + " requirements.txt ".center(76) + " #\n")
    reqin.write("# " + " requirements.in ".center(76) + " #\n")
    con.write("# " + " constraints.txt ".center(76) + " #\n")

    write("# " + "".center(76) + " #\n")

    req.write(
        "# "
        + " This list contains the locked versions of all pre-installed packages. ".center(
            76
        )
        + " #\n"
    )
    reqin.write(
        "# "
        + " This list contains the names of all pre-installed packages. ".center(76)
        + " #\n"
    )
    con.write(
        "# "
        + " This list contains the locked versions of all patched or ported ".center(76)
        + " #\n"
    )
    con.write(
        "# "
        + " packages, which must be installed with exactly the lab-provided version. ".center(
            76
        )
        + " #\n"
    )
    write("# " + "".center(76, "=") + " #\n")
    write("\n")

    write(f"# python == {python}\n", req, con)
    write(f"# pyodide == {pyodide}\n", req, con)
    write("\n", req, con)

    for name, package in sorted(packages.items(), key=lambda kv: kv[0].lower()):
        req.write(f"{name} == {package.version}\n")
        reqin.write(f"{name}\n")

        if not package.is_pure:
            con.write(f"{name} == {package.version}\n")

if len(suspicious_packages) > 0:
    raise Exception(
        "The following package names have suspicious file names:\n"
        + "\n".join(
            f" - {name}: {name_guess}" for name, name_guess in suspicious_packages
        )
    )
