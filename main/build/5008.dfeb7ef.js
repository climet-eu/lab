"use strict";(self.webpackChunk_JUPYTERLAB_CORE_OUTPUT=self.webpackChunk_JUPYTERLAB_CORE_OUTPUT||[]).push([[5008,6473],{35008:(e,t,o)=>{o.r(t),o.d(t,{default:()=>p});var n=o(64649),a=o(96954),r=o(63367),i=o(28156);const p=[{id:"@jupyterlite/notebook-application-extension:logo",autoStart:!0,activate:e=>{const t=n.PageConfig.getBaseUrl(),o=document.createElement("a");o.href=`${t}tree`,o.target="_blank",o.rel="noopener noreferrer";const i=new r.Widget({node:o});a.liteWordmark.element({container:o,elementPosition:"center",padding:"2px 2px 2px 8px",height:"28px",width:"auto"}),i.id="jp-NotebookLogo",e.shell.add(i,"top",{rank:0})}},{id:"@jupyterlite/notebook-application-extension:notify-commands",autoStart:!0,optional:[i.INotebookShell],activate:(e,t)=>{t&&t.currentChanged.connect((()=>{requestAnimationFrame((()=>{e.commands.notifyCommandChanged()}))}))}},{id:"@jupyterlite/notebook-application-extension:path-opener",autoStart:!0,provides:i.INotebookPathOpener,activate:e=>({open(e){var t;const{prefix:o,path:n,searchParams:a,target:r,features:i}=e,p=new URL(o,window.location.origin),c=new URLSearchParams(null!==(t=null==a?void 0:a.toString())&&void 0!==t?t:"");n&&c.set("path",n);const l=c.toString();return l&&(p.search=l),window.open(p,r,i)}})}]}}]);
//# sourceMappingURL=5008.dfeb7ef.js.map