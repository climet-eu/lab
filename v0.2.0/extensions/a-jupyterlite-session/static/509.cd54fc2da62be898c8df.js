"use strict";(self.webpackChunka_jupyterlite_session=self.webpackChunka_jupyterlite_session||[]).push([[509],{509:(e,t,a)=>{a.r(t),a.d(t,{default:()=>o});var i=a(314),s=a(1),n=a(347);const o={id:"a-jupyterlite-session:plugin",autoStart:!0,requires:[s.IContents],activate:(e,t)=>{const a=".sessions",s="requirements.txt";t.ready.then((async()=>{console.log("JupyterLite server extension a-jupyterlite-session is activated!");const o=await t.storage,r=new Date;await o.getItem(a)||await o.setItem(a,{name:a,path:a,last_modified:r.toISOString(),created:r.toISOString(),format:"json",mimetype:"",content:null,size:0,writable:!0,type:"directory"});const c=r.toLocaleDateString("en-us",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h24"}).replace(/\//g,"-").replace(/:/g,"-").replace(", ","-"),l=(0,n.v4)().slice(0,8),p=i.PathExt.join(a,`${c}-${l}`);await o.setItem(p,{name:i.PathExt.basename(p),path:p,last_modified:r.toISOString(),created:r.toISOString(),format:"json",mimetype:"",content:null,size:0,writable:!0,type:"directory"}),e.router.get("/api/a-session",(async e=>new Response(p)));const u=new URL(window.location.href);null!==u.searchParams.get("repo")&&(u.searchParams.set("uploadpath",p),window.history.replaceState(null,"",u)),await t.copy(s,p).catch((e=>console.warn(`Failed to copy the ${s} file to the new session: ${e}`)))}))}}}}]);