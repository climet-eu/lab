import argparse
import json
import shlex
import subprocess
import tempfile
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("a")
parser.add_argument("b")
parser.add_argument("-a", "--attribute", action="append")
args = parser.parse_args()

with open(args.a) as f:
    a = json.load(f)

with open(args.b) as f:
    b = json.load(f)

attrs = (
    set(args.attribute)
    if args.attribute is not None
    else {"name", "file_name", "imports", "depends"}
)

for package in a["packages"].values():
    package["file_name"] = Path(package["file_name"]).name

    for at in list(package.keys()):
        if at not in attrs:
            del package[at]

for package in b["packages"].values():
    package["file_name"] = Path(package["file_name"]).name

    for at in list(package.keys()):
        if at not in attrs:
            del package[at]

with tempfile.NamedTemporaryFile("w") as fa, tempfile.NamedTemporaryFile("w") as fb:
    json.dump(a, fa, sort_keys=True, indent="  ")
    json.dump(b, fb, sort_keys=True, indent="  ")

    fa.flush()
    fb.flush()

    subprocess.call(shlex.split(f"git diff --no-index {fa.name} {fb.name}"))
