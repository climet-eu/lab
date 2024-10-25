import json
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
]

for package in lock["packages"].values():
    if package["package_type"] != "package":
        continue
    if Path(package["file_name"]).suffix != ".whl":
        continue
    if package["install_dir"] != "site":
        continue

    if package["name"] in IGNORE_PACKAGES:
        continue

    if package["name"].replace("-", "_") != package["file_name"].split("-")[0]:
        print(package["name"], package["file_name"].split("-")[0])

    packages[package["name"]] = package["version"]

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

    for name, version in sorted(packages.items()):
        f.write(f"{name} == {version}\n")
