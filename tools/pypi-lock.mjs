import { readFileSync, writeFileSync } from "fs";
import { argv } from "process";

import { loadPyodide } from "./pyodide.mjs";

const [_node_path, _script_path, requirements_path, new_lockfile_path] = argv;

const requirements = readFileSync(requirements_path, { encoding: 'utf8' });

const py = await loadPyodide({ fullStdLib: true, packages: [
    "micropip", "test",
] });

await py.runPythonAsync(`
import importlib.metadata
import json
from pathlib import Path

import micropip


def get_imports_for_package(p: str) -> list[str]:
    def valid_package_name(n: str) -> bool:
        return all(invalid_chr not in n for invalid_chr in ".- ")

    imports = set()

    tree = dict()
    for f in importlib.metadata.files(p):
        # ignore special folders
        if Path(f.parts[0]).suffix in [".libs", ".dist-info", ".data"]:
            continue

        # include top-level single-file packages
        if len(f.parts) == 1 and f.suffix in [".py", ".pyc", ".so"]:
            stem = f.name.split(".")[0] if f.suffix == ".so" else f.stem
            if valid_package_name(stem):
                imports.add(stem)
                continue

        # build a tree of all other files
        t = tree
        for r in f.parts:
            if t.get(r, None) is None:
                t[r] = dict()
            t = t[r]

    # extract folders that only have folders but no files as children,
    #  these are package candidates
    queue = [([k], t) for k, t in tree.items() if len(t) > 0 and valid_package_name(k)]
    while len(queue) > 0:
        ps, tree = queue.pop()
        imports.add(".".join(ps))

        is_package = True

        add_to_queue = []
        for k, t in tree.items():
            if len(t) > 0:
                if valid_package_name(k):
                    add_to_queue.append((ps + [k], t))
            else:
                is_package = False

        if is_package:
            queue += add_to_queue

    # remove prefixes from the list
    new_imports = []
    for i in imports:
        if not any(j.startswith(f"{i}.") for j in imports if j != i):
            new_imports.append(i)

    return new_imports


extra_requirements = [
    "jupyterlite-cors == 0.0.0",  # climet-eu/lab implementation detail
    "pyodide-http == 0.2.2",  # pyodide implementation detail
]

micropip.set_index_urls(
    [
        "http://0.0.0.0:8000/pypa/simple/{package_name}/",
        "https://pypi.org/pypi/{package_name}/json",
    ]
)

micropip.set_constraints(
    [
        c
        for c in """${requirements}""".splitlines()
        if len(c.strip()) > 0 and not c.startswith("#")
    ]
    + extra_requirements
)

micropip.add_mock_package("pyarrow", "19.0.1")  # FIXME

await micropip.install(
    [
        r
        for r in """${requirements}""".splitlines()
        if len(r.strip()) > 0 and not r.startswith("#")
    ]
    + extra_requirements,
    verbose=True,
)

lock = json.loads(
    micropip.freeze()
    .replace("http://0.0.0.0:8000/static/pyodide/", "")
    .replace("/src/static/pyodide/", "")
)

# ensure that all packages have all required metadata in the lockfile
for package in lock["packages"].values():
    package["depends"] = sorted(package["depends"])

    if package["name"] != "libopenssl":
        package["imports"] = sorted(get_imports_for_package(package["name"]))

    if "package_type" not in package:
        assert Path(package["file_name"]).suffix == ".whl", (
            f"{package['name']} has no package_type"
        )
        package["package_type"] = "package"

    if "install_dir" not in package:
        assert Path(package["file_name"]).suffix == ".whl", (
            f"{package['name']} has no install_dir"
        )
        package["install_dir"] = "site"

# fix up the package name for pyodide-http
lock["packages"]["pyodide-http"]["name"] = "pyodide-http"

# remove packages provided by JupyterLite from the lockfile
# note: widgetsnbextension is special and vendored by us
for name in ["ipykernel", "piplite", "pyodide-kernel"]:
    assert lock["packages"].pop(name, None) is None

with open("/pyodide-lock.json", "w") as f:
    json.dump(lock, f, sort_keys=True)
`);

const lock = py.FS.readFile("/pyodide-lock.json", { encoding: 'utf8' });

writeFileSync(new_lockfile_path, lock);
