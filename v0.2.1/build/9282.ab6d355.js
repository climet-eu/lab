"use strict";(self.webpackChunk_JUPYTERLAB_CORE_OUTPUT=self.webpackChunk_JUPYTERLAB_CORE_OUTPUT||[]).push([[9282,9208],{19282:(e,t,o)=>{o.r(t),o.d(t,{default:()=>g});var r=o(38075),n=o(11363),a=o(41066),i=o(7801),c=o(29072),s=o(84430),d=o(89357),l=o(2260);const u="jupyterlite",p={id:"@jupyterlite/console-application:buttons",autoStart:!0,requires:[i.ITranslator],optional:[a.IConsoleTracker],activate:(e,t,o)=>{if(!o)return;const{commands:r}=e,a=t.load(u),i="repl:run";r.addCommand(i,{caption:a.__("Run"),icon:c.runIcon,execute:()=>r.execute("console:run-forced")});const s=new n.CommandToolbarButton({commands:r,id:i}),p="repl:restart";r.addCommand(p,{caption:a.__("Restart"),icon:c.refreshIcon,execute:()=>r.execute("console:restart-kernel")});const m=new n.CommandToolbarButton({commands:r,id:p}),h="repl:clear";r.addCommand(h,{caption:a.__("Clear"),icon:c.clearIcon,execute:()=>r.execute("console:clear")});const w=new n.CommandToolbarButton({commands:r,id:h});o.widgetAdded.connect(((e,t)=>{const{toolbar:o}=t;t.toolbar.addItem("run",s),t.toolbar.addItem("restart",m),t.toolbar.addItem("clear",w),o.addItem("spacer",n.Toolbar.createSpacerItem());const r=document.createElement("a");r.title=a.__("Powered by JupyterLite"),r.href="https://github.com/jupyterlite/jupyterlite",r.target="_blank",r.rel="noopener noreferrer";const i=new l.Widget({node:r});d.liteIcon.element({container:r,elementPosition:"center",margin:"2px 2px 2px 8px",height:"auto",width:"16px"}),i.addClass("jp-PoweredBy"),o.insertAfter("spacer","powered-by",i)}))}},m={id:"@jupyterlite/repl-extension:console",autoStart:!0,optional:[a.IConsoleTracker,n.IThemeManager],activate:(e,t,o)=>{var r;if(!t)return;const{commands:n,serviceManager:a,started:i}=e,c=window.location.search,s=new URLSearchParams(c),d=s.getAll("code"),l=s.get("execute"),u=s.get("kernel")||void 0,p=null===(r=s.get("theme"))||void 0===r?void 0:r.trim(),m=s.get("toolbar");if(Promise.all([i,a.ready]).then((async()=>{n.execute("console:create",{kernelPreference:{name:u}})})),p&&o){const e=decodeURIComponent(p);o.setTheme(e)}t.widgetAdded.connect((async(e,t)=>{const{console:o}=t;if(m||t.toolbar.dispose(),d)if(await o.sessionContext.ready,"0"===l){const e=d.join("\n");o.replaceSelection(e)}else d.forEach((e=>o.inject(e)))}))}},h={id:"@jupyterlite/repl-extension:status",autoStart:!0,provides:r.ILabStatus,requires:[i.ITranslator],activate:(e,t)=>{if(!(e instanceof s.SingleWidgetApp)){const e=t.load(u);throw new Error(e.__("%1 must be activated in SingleWidgetApp.",h.id))}return e.status}},w={id:"@jupyterlite/repl-extension:paths",autoStart:!0,provides:r.JupyterFrontEnd.IPaths,activate:e=>{if(!(e instanceof s.SingleWidgetApp))throw new Error(`${w.id} must be activated in SingleWidgetApp.`);return e.paths}},b={id:"@jupyterlite/repl-extension:router",autoStart:!0,provides:r.IRouter,requires:[r.JupyterFrontEnd.IPaths],activate:(e,t)=>{const{commands:o}=e,n=t.urls.base,a=new r.Router({base:n,commands:o});return e.started.then((()=>{a.route(),window.addEventListener("popstate",(()=>{a.route()}))})),a}},g=[p,m,w,b,h]}}]);
//# sourceMappingURL=9282.ab6d355.js.map