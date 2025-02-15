import argparse
import json
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("dist_path")
args = parser.parse_args()

dist_path = Path(args.dist_path)
lock_path = dist_path / "pyodide-lock.json"

with lock_path.open("r") as f:
    lock = json.load(f)

packages_to_delete = set()
all_dependencies = set()

for name, package in lock["packages"].items():
    all_dependencies.update(package["depends"])

    if package["unvendored_tests"] is not True:
        continue

    packages_to_delete.add(f"{name}-tests")
    package["unvendored_tests"] = False

for name, package in lock["packages"].items():
    if package["package_type"] != "shared_library":
        continue

    if name in all_dependencies:
        continue

    packages_to_delete.add(name)


for name in packages_to_delete:
    filename = lock["packages"][name]["file_name"]
    print(f"Removed {filename}")
    (dist_path / filename).unlink()

    del lock["packages"][name]

for package in lock["packages"].values():
    package["depends"] = sorted(package["depends"])
    package["imports"] = sorted(package["imports"])

with lock_path.open("w") as f:
    json.dump(lock, f, sort_keys=True)
