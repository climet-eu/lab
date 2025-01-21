from pathlib import Path

import yaml

packages_path = Path("pyodide") / "packages"

dependencies_path = Path("tools") / "dependencies.txt"
requirements_path = Path("tools") / "requirements.txt"

with dependencies_path.open("r") as f:
    dependencies = f.read().splitlines()

PACKAGE_PYPI_NAME_FIXES = {
    "Markdown": "markdown",
    "netCDF4": "netcdf4",
    "pillow": "Pillow",
    "Pint": "pint",
    "PyYAML": "pyyaml",
    "WebOb": "Webob",
}

requirements = dict()

for dependency in dependencies:
    with (packages_path / PACKAGE_PYPI_NAME_FIXES.get(dependency, dependency) / "meta.yaml").open("r") as f:
        recipe = yaml.load(f, yaml.SafeLoader)
    
    requirements[dependency] = recipe["package"]["version"]

with requirements_path.open("w") as f:
    for name, version in sorted(requirements.items(), key=lambda kv: kv[0].lower()):
        f.write(f"{name} == {version}\n")
