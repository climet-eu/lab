import argparse
import json
import shutil
from pathlib import Path
from urllib.request import urlopen

parser = argparse.ArgumentParser()
parser.add_argument("dist_path")
args = parser.parse_args()

dist_path = Path(args.dist_path)
lock_path = dist_path / "pyodide-lock.json"
recipes_path = Path("pyodide") / "pyodide-recipes" / "packages"


# read in the lockfile
with lock_path.open("r") as f:
    lock = json.load(f)


# download wheels from PyPi and inline them into the lockfile
for name, package in lock["packages"].items():
    url = package["file_name"]
    filename = Path(url).name

    if not url.startswith("https://files.pythonhosted.org/packages"):
        continue

    with urlopen(url) as response:
        with (dist_path / filename).open("wb") as file:
            shutil.copyfileobj(response, file)

    with urlopen(f"{url}.metadata") as response:
        with (dist_path / f"{filename}.metadata").open("wb") as file:
            shutil.copyfileobj(response, file)

    package["file_name"] = filename


# ensure that the inlined lockfile has a deterministic (sorted) layout
for package in lock["packages"].values():
    package["depends"] = sorted(package["depends"])
    package["imports"] = sorted(package["imports"])

# write out the inlined lockfile
with lock_path.open("w") as f:
    json.dump(lock, f, sort_keys=True)
