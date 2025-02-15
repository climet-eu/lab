import argparse
import json
import shlex
import subprocess
import tempfile
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("a")
parser.add_argument("b")
args = parser.parse_args()

with open(args.a) as f:
    a = json.load(f)

with open(args.b) as f:
    b = json.load(f)

for package in a["packages"].values():
    package["file_name"] = Path(package["file_name"]).name
    del package["sha256"]

    if "package_type" in package:
        del package["package_type"]
    if "unvendored_tests" in package:
        del package["unvendored_tests"]

for package in b["packages"].values():
    package["file_name"] = Path(package["file_name"]).name
    del package["sha256"]

    if "package_type" in package:
        del package["package_type"]
    if "unvendored_tests" in package:
        del package["unvendored_tests"]

with tempfile.NamedTemporaryFile("w") as fa, tempfile.NamedTemporaryFile("w") as fb:
    json.dump(a, fa, sort_keys=True, indent="  ")
    json.dump(b, fb, sort_keys=True, indent="  ")

    subprocess.call(shlex.split(f"git diff --no-index {fa.name} {fb.name}"))
