"use strict";(self.webpackChunk_JUPYTERLAB_CORE_OUTPUT=self.webpackChunk_JUPYTERLAB_CORE_OUTPUT||[]).push([[8387,3992],{93992:(e,t,o)=>{o.r(t),o.d(t,{default:()=>s});var n=o(64649),a=o(31228),i=o(28156),d=o(2159);const s=[{id:"@jupyter-notebook/docmanager-extension:opener",autoStart:!0,optional:[i.INotebookPathOpener,i.INotebookShell],provides:a.IDocumentWidgetOpener,description:"Open documents in a new browser tab",activate:(e,t,o)=>{const a=n.PageConfig.getBaseUrl(),s=e.docRegistry,r=null!=t?t:i.defaultNotebookPathOpener;let l=0;return new class{constructor(){this._opened=new d.Signal(this)}async open(t,i){var d,c,u;const p=null!==(d=null==i?void 0:i.type)&&void 0!==d?d:"",h=null==i?void 0:i.ref,v=null===(u=null===(c=null==o?void 0:o.userLayout)||void 0===c?void 0:c[p])||void 0===u?void 0:u.area;if("_noref"!==h&&void 0===v){const e=t.context.path,o=n.PathExt.extname(e);let i,d="edit";return("default"===p&&".ipynb"===o||p.includes("Notebook"))&&(t.context.sessionContext.kernelPreference.name&&await t.context.save(),d="notebooks"),p!==s.defaultWidgetFactory(e).name&&(i=new URLSearchParams({factory:p})),r.open({prefix:n.URLExt.join(a,d),path:e,searchParams:i}),void t.dispose()}t.id||(t.id="document-manager-"+ ++l),t.title.dataset={type:"document-title",...t.title.dataset},t.isAttached||e.shell.add(t,"main",i||{}),e.shell.activateById(t.id),this._opened.emit(t)}get opened(){return this._opened}}}}]}}]);
//# sourceMappingURL=8387.fec6150.js.map