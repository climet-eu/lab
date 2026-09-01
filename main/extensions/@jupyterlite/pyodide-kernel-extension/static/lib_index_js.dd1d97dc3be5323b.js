"use strict";
(self["rspackChunk_jupyterlite_pyodide_kernel_extension"] = self["rspackChunk_jupyterlite_pyodide_kernel_extension"] || []).push([["lib_index_js"], {
"./lib/index.js"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
var _schema_kernel_v0_schema_json__rspack_import_4_namespace_cache;
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  KERNEL_SETTINGS_SCHEMA: () => (/* reexport fake namespace object from non-ESM */ _schema_kernel_v0_schema_json__rspack_import_4_namespace_cache || (_schema_kernel_v0_schema_json__rspack_import_4_namespace_cache = __webpack_require__.t(_schema_kernel_v0_schema_json__rspack_import_4))),
  "default": () => (__rspack_default_export)
});
/* import */ var _jupyterlab_coreutils__rspack_import_0 = __webpack_require__("webpack/sharing/consume/default/@jupyterlab/coreutils");
/* import */ var _jupyterlab_coreutils__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_coreutils__rspack_import_0);
/* import */ var _jupyterlab_logconsole__rspack_import_1 = __webpack_require__("webpack/sharing/consume/default/@jupyterlab/logconsole");
/* import */ var _jupyterlab_logconsole__rspack_import_1_default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_logconsole__rspack_import_1);
/* import */ var _jupyterlite_apputils__rspack_import_2 = __webpack_require__("webpack/sharing/consume/default/@jupyterlite/apputils/@jupyterlite/apputils");
/* import */ var _jupyterlite_apputils__rspack_import_2_default = /*#__PURE__*/__webpack_require__.n(_jupyterlite_apputils__rspack_import_2);
/* import */ var _jupyterlite_services__rspack_import_3 = __webpack_require__("webpack/sharing/consume/default/@jupyterlite/services");
/* import */ var _jupyterlite_services__rspack_import_3_default = /*#__PURE__*/__webpack_require__.n(_jupyterlite_services__rspack_import_3);
/* import */ var _style_img_pyodide_svg__rspack_import_5 = __webpack_require__("./style/img/pyodide.svg");
/* import */ var _schema_kernel_v0_schema_json__rspack_import_4 = __webpack_require__("./schema/kernel.v0.schema.json");
// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.






const KERNEL_ICON_URL = `data:image/svg+xml;base64,${btoa(_style_img_pyodide_svg__rspack_import_5)}`;
/**
 * The default CDN fallback for Pyodide
 */
const PYODIDE_CDN_URL = 'https://cdn.jsdelivr.net/pyodide/v314.0.4/full/pyodide.mjs';
/**
 * The id for the extension, and key in the litePlugins.
 */
const PLUGIN_ID = '@jupyterlite/pyodide-kernel-extension:kernel';
/**
 * A plugin to register the Pyodide kernel.
 */
const kernel = {
    id: PLUGIN_ID,
    description: 'A plugin providing the Pyodide kernel.',
    autoStart: true,
    requires: [_jupyterlite_services__rspack_import_3.IKernelSpecs],
    optional: [_jupyterlite_apputils__rspack_import_2.IServiceWorkerManager, _jupyterlab_logconsole__rspack_import_1.ILoggerRegistry],
    activate: (app, kernelspecs, serviceWorkerManager, loggerRegistry) => {
        const { contents: contentsManager, sessions } = app.serviceManager;
        const config = JSON.parse(_jupyterlab_coreutils__rspack_import_0.PageConfig.getOption('litePluginSettings') || '{}')[PLUGIN_ID] || {};
        const baseUrl = _jupyterlab_coreutils__rspack_import_0.PageConfig.getBaseUrl();
        const url = config.pyodideUrl || PYODIDE_CDN_URL;
        const pyodideUrl = _jupyterlab_coreutils__rspack_import_0.URLExt.parse(url).href;
        const pipliteWheelUrl = config.pipliteWheelUrl
            ? _jupyterlab_coreutils__rspack_import_0.URLExt.parse(config.pipliteWheelUrl).href
            : undefined;
        const rawPipUrls = config.pipliteUrls || [];
        const pipliteUrls = rawPipUrls.map((pipUrl) => _jupyterlab_coreutils__rspack_import_0.URLExt.parse(pipUrl).href);
        const disablePyPIFallback = !!config.disablePyPIFallback;
        const loadPyodideOptions = config.loadPyodideOptions || {};
        for (const [key, value] of Object.entries(loadPyodideOptions)) {
            if (key.endsWith('URL') && typeof value === 'string') {
                loadPyodideOptions[key] = new URL(value, baseUrl).href;
            }
        }
        // The logger will find the notebook associated with the kernel id
        // and log the payload to the log console for that notebook.
        const logger = async (options) => {
            var _a;
            if (!loggerRegistry) {
                // nothing to do in this case
                return;
            }
            const { payload, kernelId } = options;
            // Find the session path that corresponds to the kernel ID
            let sessionPath = '';
            for (const session of sessions.running()) {
                if (((_a = session.kernel) === null || _a === void 0 ? void 0 : _a.id) === kernelId) {
                    sessionPath = session.path;
                    break;
                }
            }
            const logger = loggerRegistry.getLogger(sessionPath);
            logger.log(payload);
        };
        kernelspecs.register({
            spec: {
                name: 'python',
                display_name: 'Python (Pyodide)',
                language: 'python',
                argv: [],
                resources: {
                    'logo-32x32': KERNEL_ICON_URL,
                    'logo-64x64': KERNEL_ICON_URL,
                },
            },
            create: async (options) => {
                const { PyodideKernel } = await __webpack_require__.e(/* import() */ "webpack_sharing_consume_default_jupyterlite_pyodide-kernel_jupyterlite_pyodide-kernel").then(__webpack_require__.t.bind(__webpack_require__, "webpack/sharing/consume/default/@jupyterlite/pyodide-kernel/@jupyterlite/pyodide-kernel", 23));
                const mountDrive = !!((serviceWorkerManager === null || serviceWorkerManager === void 0 ? void 0 : serviceWorkerManager.enabled) || crossOriginIsolated);
                const kernel = new PyodideKernel({
                    ...options,
                    pyodideUrl,
                    pipliteWheelUrl,
                    pipliteUrls,
                    disablePyPIFallback,
                    mountDrive,
                    loadPyodideOptions,
                    contentsManager,
                    browsingContextId: serviceWorkerManager === null || serviceWorkerManager === void 0 ? void 0 : serviceWorkerManager.browsingContextId,
                    logger,
                });
                if (mountDrive) {
                    console.info('Pyodide contents will be synced with Jupyter Contents');
                }
                else {
                    const warningMessage = 'Pyodide contents will NOT be synced with Jupyter Contents. ' +
                        'For full functionality, try using a regular browser tab instead of private/incognito mode, ' +
                        'especially in Firefox where this is a known limitation.';
                    console.warn(warningMessage);
                    // Wait for kernel to be ready before logging the warning
                    kernel.ready.then(() => {
                        if (loggerRegistry) {
                            void logger({
                                payload: {
                                    type: 'text',
                                    data: warningMessage,
                                    level: 'warning',
                                },
                                kernelId: options.id,
                            });
                        }
                    });
                }
                return kernel;
            },
        });
    },
};
const plugins = [kernel];
/* export default */ const __rspack_default_export = (plugins);


},
"./schema/kernel.v0.schema.json"(module, __unused_rspack_exports, __webpack_require__) {
module.exports = __webpack_require__.p + "schema/kernel.v0.schema.json";

},
"./style/img/pyodide.svg"(module) {
module.exports = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg width=\"182\" height=\"182\" data-name=\"Layer 1\" version=\"1.1\" viewBox=\"0 0 182 182\" xmlns=\"http://www.w3.org/2000/svg\">\n <defs>\n  <style>.cls-1 {\n        fill: #fff;\n      }\n\n      .cls-2 {\n        fill: #654ff0;\n      }</style>\n </defs>\n <rect width=\"182\" height=\"182\" fill=\"#fff\" stop-color=\"#000000\" style=\"paint-order:stroke fill markers\"/>\n <rect class=\"cls-1\" x=\"107\" y=\"125\" width=\"50\" height=\"32\"/>\n <path class=\"cls-2\" d=\"m135.18 97c0-0.13-0.01-7.24-0.02-7.37h27.51v71.33h-71.34v-71.33h27.51c0 0.13-0.02 7.24-0.02 7.37m32.59 56.33h4.9l-7.43-25.25h-7.45l-6.12 25.25h4.75l1.24-5.62h8.49l1.61 5.62zm-26.03 0h4.69l6.02-25.25h-4.63l-3.69 17.4h-0.06l-3.5-17.4h-4.42l-3.9 17.19h-0.06l-3.23-17.19h-4.72l5.44 25.25h4.78l3.75-17.19h0.06zm18.89-19.03h1.99l2.37 9.27h-6.42z\"/>\n <path d=\"m89 49.66c0 10.6-8.8 20-20 20h-40v20h-10v-70h50c10.7 0 19.7 8.9 20 20zm-10-10c0-5.5-4.5-10-10-10h-40v30h40c5.5 0 10-4.5 10-10z\"/>\n <path d=\"m132 67.66v22h-10v-22l-30-33v-15h10v10.9l25 27.5 25-27.5v-10.9h10v15z\"/>\n</svg>\n";

},

}]);
//# sourceMappingURL=lib_index_js.dd1d97dc3be5323b.js.map