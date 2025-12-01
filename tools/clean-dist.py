import argparse
import json
import yaml
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("dist_path")
args = parser.parse_args()

dist_path = Path(args.dist_path)
lock_path = dist_path / "pyodide-lock.json"
recipes_path = Path("pyodide") / "pyodide-recipes" / "packages"

with lock_path.open("r") as f:
    lock = json.load(f)


# collect all packages that are dependencies of other packages
all_dependencies = set()
for name, package in lock["packages"].items():
    all_dependencies.update(package["depends"])


packages_to_delete = set()


# collect unvendored test packages for deletion
for name, package in lock["packages"].items():
    if package["unvendored_tests"] is not True:
        continue

    packages_to_delete.add(f"{name}-tests")
    package["unvendored_tests"] = False


# collect unused shared libaries for deletion
for name, package in lock["packages"].items():
    if package["package_type"] != "shared_library":
        continue

    if name in all_dependencies:
        continue

    packages_to_delete.add(name)


# collect pure Python packages from PyPi for deletion
for name, package in lock["packages"].items():
    if package["package_type"] != "package":
        continue
    if Path(package["file_name"]).suffix != ".whl":
        continue
    if package["install_dir"] != "site":
        continue

    with open(recipes_path / package["name"] / "meta.yaml") as f:
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
        packages_to_delete.add(name)


# actually delete the packages
for name in packages_to_delete:
    filename = lock["packages"][name]["file_name"]

    print(f"Removed {name}: {filename}")

    (dist_path / filename).unlink()
    (dist_path / f"{filename}.metadata").unlink(missing_ok=True)

    del lock["packages"][name]


# create and write the clean lockfile
for package in lock["packages"].values():
    package["depends"] = sorted(package["depends"])
    package["imports"] = sorted(package["imports"])

with lock_path.open("w") as f:
    json.dump(lock, f, sort_keys=True)
