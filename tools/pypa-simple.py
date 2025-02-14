import argparse
import json
import re
import shutil
import yaml
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("pypa_path")
parser.add_argument("pyodide_url")
args = parser.parse_args()

lock_path = Path("pyodide") / "dist" / "pyodide-lock.json"
recipe_path = Path("pyodide") / "packages"
pypa_path = Path(args.pypa_path)

if pypa_path.exists():
    shutil.rmtree(pypa_path)
pypa_path.mkdir(parents=True, exist_ok=True)

with lock_path.open("r") as f:
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

    with open(recipe_path / package["name"] / "meta.yaml") as f:
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
        print(f"excluding pure PyPi package {package['name']} from repository")
        continue

    name = PACKAGE_PYPI_NAME_FIXES.get(package["name"], package["name"])
    packages[name] = dict(filename=package["file_name"], sha256=package["sha256"])

with (pypa_path / "index.html").open("w") as f:
    f.write("""<!DOCTYPE html>
<html>
    <head>
        <meta name="pypi:repository-version" content="1.0">
        <title>Simple index</title>
    </head>
    <body>""")

    for name in packages.keys():
        normalized_name = re.sub(r"[-_.]+", "-", name).lower()

        f.write(f"""
        <a href="./{normalized_name}/">{name}</a><br>""")

    f.write("""
    </body>
</html>""")

for name, package in packages.items():
    normalized_name = re.sub(r"[-_.]+", "-", name).lower()

    (pypa_path / normalized_name).mkdir(parents=True, exist_ok=True)

    with (pypa_path / normalized_name / "index.html").open("w") as f:
        f.write(f"""<!DOCTYPE html>
<html>
    <head>
        <meta name="pypi:repository-version" content="1.0">
        <title>Links for {normalized_name}</title>
    </head>
    <body>
        <h1>Links for {normalized_name}</h1>
        <a href="{args.pyodide_url.rstrip('/')}/{package['filename']}#sha256={package['sha256']}" data-dist-info-metadata data-core-metadata">{package['filename']}</a><br> 
    </body>
</html>""")
