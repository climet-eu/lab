"use strict";(self.webpackChunk_JUPYTERLAB_CORE_OUTPUT=self.webpackChunk_JUPYTERLAB_CORE_OUTPUT||[]).push([[9282,9208],{19282:(e,t,n)=>{n.r(t),n.d(t,{default:()=>v});var o=n(32276),r=n(51377),i=n(2577),a=n(56609),s=n(18206),l=n(96954),d=n(63367);const c="jupyterlite",u={id:"@jupyterlite/repl-extension:buttons",autoStart:!0,requires:[a.ITranslator],optional:[r.IToolbarWidgetRegistry],activate:(e,t,n)=>{const o=t.load(c);if(n){const e="ConsolePanel";n.addFactory(e,"liteIcon",(e=>{const t=document.createElement("a");t.title=o.__("Powered by JupyterLite"),t.href="https://github.com/jupyterlite/jupyterlite",t.target="_blank",t.rel="noopener noreferrer";const n=new d.Widget({node:t});return l.liteIcon.element({container:t,elementPosition:"center",margin:"2px",height:"auto",width:"16px"}),n.addClass("jp-PoweredBy"),n}))}}},p={id:"@jupyterlite/repl-extension:console",autoStart:!0,optional:[i.IConsoleTracker,r.IThemeManager],activate:(e,t,n)=>{var o,r;if(!t)return;const{commands:i,started:a}=e,s=window.location.search,l=new URLSearchParams(s),d=l.getAll("code"),c=l.get("execute"),u=l.get("kernel")||void 0,p=null===(o=l.get("theme"))||void 0===o?void 0:o.trim(),g=l.get("toolbar"),h="1"===l.get("clearCellsOnExecute")||void 0,m="0"!==l.get("clearCodeContentOnExecute")&&void 0,v="1"===l.get("hideCodeInput")||void 0,C="0"!==l.get("showBanner")&&void 0,w=null!==(r=l.get("promptCellPosition"))&&void 0!==r?r:"",f=["top","bottom","left","right"].includes(w)?w:void 0;if(a.then((async()=>{i.execute("console:create",{kernelPreference:{name:u}})})),t.widgetAdded.connect((async(e,t)=>{g||t.toolbar.dispose();const{console:n}=t,{sessionContext:o}=n;if(await o.ready,n.setConfig({clearCellsOnExecute:h,clearCodeContentOnExecute:m,hideCodeInput:v,promptCellPosition:f,showBanner:C}),n._onKernelChanged(),d.length>0)if("0"===c){const e=d.join("\n");n.replaceSelection(e)}else d.forEach((e=>n.inject(e)))})),p&&n){const e=decodeURIComponent(p);n.setTheme(e)}}},g={id:"@jupyterlite/repl-extension:status",autoStart:!0,provides:o.ILabStatus,requires:[a.ITranslator],activate:(e,t)=>{if(!(e instanceof s.SingleWidgetApp)){const e=t.load(c);throw new Error(e.__("%1 must be activated in SingleWidgetApp.",g.id))}return e.status}},h={id:"@jupyterlite/repl-extension:paths",autoStart:!0,provides:o.JupyterFrontEnd.IPaths,activate:e=>{if(!(e instanceof s.SingleWidgetApp))throw new Error(`${h.id} must be activated in SingleWidgetApp.`);return e.paths}},m={id:"@jupyterlite/repl-extension:router",autoStart:!0,provides:o.IRouter,requires:[o.JupyterFrontEnd.IPaths],activate:(e,t)=>{const{commands:n}=e,r=t.urls.base,i=new o.Router({base:r,commands:n});return e.started.then((()=>{i.route(),window.addEventListener("popstate",(()=>{i.route()}))})),i}},v=[u,p,h,m,g]}}]);
//# sourceMappingURL=9282.58566be.js.map