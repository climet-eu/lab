"use strict";(self.webpackChunka_jupyterlite_session=self.webpackChunka_jupyterlite_session||[]).push([[509],{509:(e,t,a)=>{a.r(t),a.d(t,{default:()=>o});var i=a(597),s=a(1),n=a(347);const o={id:"a-jupyterlite-session:plugin",autoStart:!0,requires:[s.IContents],activate:(e,t)=>{const a=".sessions",s="README.md",o="requirements.txt";t.ready.then((async()=>{console.log("JupyterLite server extension a-jupyterlite-session is activated!");const r=await t.storage,c=new Date;await r.getItem(a)||await r.setItem(a,{name:a,path:a,last_modified:c.toISOString(),created:c.toISOString(),format:"json",mimetype:"",content:null,size:0,writable:!0,type:"directory"});const l=c.toLocaleDateString("en-us",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h24"}).replace(/\//g,"-").replace(/:/g,"-").replace(", ","-"),p=(0,n.v4)().slice(0,8),d=i.PathExt.join(a,`${l}-${p}`);await r.setItem(d,{name:i.PathExt.basename(d),path:d,last_modified:c.toISOString(),created:c.toISOString(),format:"json",mimetype:"",content:null,size:0,writable:!0,type:"directory"}),e.router.get("/api/a-session",(async e=>new Response(d)));const u=new URL(window.location.href);null!==u.searchParams.get("repo")&&(u.searchParams.set("uploadpath",d),window.history.replaceState(null,"",u)),await t.copy(s,d).catch((e=>console.warn(`Failed to copy the ${s} file to the new session: ${e}`))),await t.copy(o,d).catch((e=>console.warn(`Failed to copy the ${o} file to the new session: ${e}`)))}))}}}}]);