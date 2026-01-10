import { readFileSync } from "fs";
import { argv, exit } from "process";

import { loadPyodide } from "./pyodide.mjs";

const EXPECTED_FAILURES = [
    // https://github.com/ecmwf/eccodes-python/issues/116
    "gribapi[eccodes]",
    // FIXME: `js.postMessage` only exists in the browser
    "ipyfilite[ipyfilite]",
    // requires `fcntl`, which Pyodide doesn't support (but JupyterLite mocks)
    "locket[locket]", "partd[partd]",
];

const [_node_path, _script_path, bootstrap_path] = argv;

const bootstrap = readFileSync(bootstrap_path, { encoding: 'utf8' }).concat(`
assert pyodide.ffi.can_run_sync()
patch_import_loader()
`);

const py = await loadPyodide({ fullStdLib: true, packages: ["micropip"] });

const successes = [];
const failures = [];

for (const [package_name, package_] of Object.entries(py.lockfile.packages)) {
    for (const import_ of package_.imports) {
        const import_info = `${import_}[${package_name}]`;

        console.log(`trying to import ${import_info} ...`);

        const py = await loadPyodide({ fullStdLib: true, packages: [] });
        await py.runPythonAsync(bootstrap);

        try {
            await py.runPythonAsync(`import ${import_}`);
            console.log(`success: ${import_info}`);
            successes.push(import_info);
        } catch {
            console.error(`FAIL: ${import_info}`);
            failures.push(import_info);
        }
    }
}

console.log(`successfully imported ${successes.length}/${successes.length+failures.length}`);

if (failures.length > 0) {
    console.error(`failed to import ${failures.length}: ${failures}`);
}

if (JSON.stringify(failures) != JSON.stringify(EXPECTED_FAILURES)) {
    throw new Error(`unexpected import failures, expected ${EXPECTED_FAILURES}`);
}

// explicit exit for faster cleanup of the Pyodide runtimes
exit(0);
