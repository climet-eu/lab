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

packages_to_delete = []

for name, package in lock["packages"].items():
    if package["unvendored_tests"] is not True:
        continue

    filename = lock["packages"][f"{name}-tests"]["file_name"]
    print(f"Removed {filename}")
    (dist_path / filename).unlink()

    packages_to_delete.append(f"{name}-tests")
    package["unvendored_tests"] = False

for name in packages_to_delete:
    del lock["packages"][name]

with lock_path.open("w") as f:
    json.dump(lock, f, sort_keys=True)
