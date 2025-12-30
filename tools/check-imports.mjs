import { readFileSync } from "fs";
import { argv } from "process";

import { loadPyodide } from "./pyodide.mjs";

const [_node_path, _script_path, bootstrap_path] = argv;

const bootstrap = readFileSync(bootstrap_path, { encoding: 'utf8' }).concat(`
if not pyodide.ffi.can_run_sync():
    patch_syncifiable_asyncio()
patch_import_loader()
`);

const py = await loadPyodide({ fullStdLib: true, packages: ["micropip"] });

for (const [package_name, package_] of Object.entries(py.lockfile.packages)) {
    for (const import_ of package_.imports) {
        console.log(`trying import ${import_} from ${package_name} ...`);

        const py = await loadPyodide({ fullStdLib: true, packages: [] });
        await py.runPythonAsync(bootstrap);

        try {
            await py.runPythonAsync(`import ${import_}`);
            console.log("success");
        } catch {
            console.error("FAIL");
        }
    }
}
