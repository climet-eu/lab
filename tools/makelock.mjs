import { readFileSync, writeFileSync } from "fs";
import { argv } from "process";

import { loadPyodide } from "./pyodide.mjs";

const [_node_path, _script_path, requirements_path, new_lockfile_path] = argv;

const requirements = readFileSync(requirements_path, { encoding: 'utf8' });

const py = await loadPyodide({ packages: ["micropip"] });

await py.runPythonAsync(`
import json

import micropip

micropip.set_index_urls([
    "http://0.0.0.0:8000/pypa/simple/{package_name}/",
    "https://pypi.org/pypi/{package_name}/json",
])

micropip.set_constraints([
    c for c in """${requirements}""".splitlines()
    if len(c) > 0 and not c.startswith('#')
])

await micropip.install([
    r for r in """${requirements}""".splitlines()
    if len(r) > 0 and not r.startswith('#')
], verbose=True)

lock = micropip.freeze().replace("http://0.0.0.0:8000/dist/", "")

with open("/pyodide-lock.json", "w") as f:
    json.dump(json.loads(lock), f, sort_keys=True)
`);

const lock = py.FS.readFile("/pyodide-lock.json", { encoding: 'utf8' });

writeFileSync(new_lockfile_path, lock);
