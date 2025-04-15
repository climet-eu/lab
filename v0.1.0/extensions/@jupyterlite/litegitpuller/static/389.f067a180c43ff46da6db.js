"use strict";(self.webpackChunk_jupyterlite_litegitpuller=self.webpackChunk_jupyterlite_litegitpuller||[]).push([[389],{389:(e,t,n)=>{n.r(t),n.d(t,{default:()=>h,testNbGitPuller:()=>c});var a=n(492),i=n(814),r=n(182);class s{constructor(e){this._errors=new Map,this._defaultFileBrowser=e.defaultFileBrowser,this._contents=e.contents}async clone(e,t,n){await this.createTree([n]);const i=await this.getFileList(e,t);return await this.createTree(i.directories,n).then((async()=>{for(const r of i.files){const i=n?a.PathExt.join(n,r):r;if(await this.fileExists(i)){this.addUploadError("File already exist",i);continue}const s=await this.getFile(e,r,t);await this.createFile(i,s.blob,s.type)}})),this._errors.forEach(((e,t)=>{console.warn(`The following files have not been uploaded.\nCAUSE: ${t}\nFILES: `,e)})),n}async createTree(e,t=null){e.sort();for(let n of e){n=t?a.PathExt.join(t,n):n;const e={type:"directory",path:a.PathExt.dirname(n)};await this._contents.get(n,{content:!1}).catch((()=>{this._contents.newUntitled(e).then((async e=>{await this._contents.rename(e.path,n)}))}))}}async fileExists(e){return this._contents.get(e,{content:!1}).then((()=>!0)).catch((()=>!1))}async createFile(e,t,n){let i=a.PathExt.basename(e),r=0,s=!1;for(;!s;)await this._contents.get(i,{content:!1}).then((()=>{i=`${r}_${i}`,r++})).catch((e=>{s=!0}));const o=new File([t],i,{type:n});await this._defaultFileBrowser.model.upload(o).then((async t=>{t.path!==e&&await this._contents.rename(t.path,e)}))}addUploadError(e,t){var n;const a=null!==(n=this._errors.get(e))&&void 0!==n?n:[];this._errors.set(e,[...a,t])}}class o extends s{async getFileList(e,t){const n=`${e}/git/trees/${t}?recursive=true`,a=await fetch(n,{method:"GET",headers:{Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28","User-Agent":"request"}}).then((e=>e.json())).then((e=>e.tree));return{directories:Object.values(a).filter((e=>"tree"===e.type)).map((e=>e.path)),files:Object.values(a).filter((e=>"blob"===e.type)).map((e=>e.path))}}async getFile(e,t,n){var a;const i=`${e}/contents/${t}?ref=${n}`,r=await fetch(i,{method:"GET",headers:{Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28","User-Agent":"request"}}).then((e=>e.json())).then((e=>e.download_url)),s=await fetch(r);return{blob:await s.blob(),type:null!==(a=s.headers.get("Content-Type"))&&void 0!==a?a:""}}}class l extends s{async getFileList(e,t){const n=`${e}/repository/tree?ref=${t}&recursive=true`,a=await fetch(n,{method:"GET"}).then((e=>e.json())).then((e=>e));return{directories:Object.values(a).filter((e=>"tree"===e.type)).map((e=>e.path)),files:Object.values(a).filter((e=>"blob"===e.type)).map((e=>e.path))}}async getFile(e,t,n){var a;const i=`${e}/repository/files/${encodeURIComponent(t)}/raw?ref=${n}`,r=await fetch(i);return{blob:await r.blob(),type:null!==(a=r.headers.get("Content-Type"))&&void 0!==a?a:""}}}async function c(){const e=r.ServerConnection.makeSettings(),t=a.URLExt.join(e.baseUrl,"git-pull","api");let n;try{n=await r.ServerConnection.makeRequest(t,{method:"GET"},e)}catch(e){return!1}return!!n.ok}const h={id:"@jupyterlite/litegitpuller:plugin",autoStart:!0,requires:[i.IDefaultFileBrowser],activate:async(e,t)=>{if(await c())return void console.log("@jupyterlite/litegitpuller is not activated, to avoid conflict with nbgitpuller");console.log("JupyterLab extension @jupyterlite/litegitpuller is activated!");const n=new URLSearchParams(window.location.search),i=n.get("repo");if(!i)return;let r=null;const s=a.PathExt.basename(i),h=n.get("branch")||"main",p=n.get("provider")||"github";let u=n.get("urlpath");const d=new URL(i);if("github"===p){if("github.com"!==d.hostname)return void console.warn("litegitpuller: the URL does not match with a GITHUB repository");d.hostname="api.github.com",d.pathname=`/repos${d.pathname}`,r=new o({defaultFileBrowser:t,contents:e.serviceManager.contents})}else"gitlab"===p&&(d.pathname=`/api/v4/projects/${encodeURIComponent(d.pathname.slice(1))}`,r=new l({defaultFileBrowser:t,contents:e.serviceManager.contents}));r&&r.clone(d.href,h,s).then((async t=>{u&&(u=a.PathExt.relative("tree/",u),e.commands.execute("filebrowser:open-path",{path:u}))}))}}}}]);