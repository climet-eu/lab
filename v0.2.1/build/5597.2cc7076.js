"use strict";(self.webpackChunk_JUPYTERLAB_CORE_OUTPUT=self.webpackChunk_JUPYTERLAB_CORE_OUTPUT||[]).push([[5597,3245],{95597:(e,t,s)=>{s.r(t),s.d(t,{ILicenses:()=>i,Licenses:()=>o,THIRD_PARTY_LICENSES:()=>r});var n=s(76107),a=s(21961);const r="third-party-licenses.json",i=new a.Token("@jupyterlite/licenses:ILicenses"),c=Object.freeze({packages:[]});class o{async get(){return{bundles:{...await this._getFederated(),[this.appName]:await this._getAppLicenses()}}}get appName(){return n.PageConfig.getOption("appName")||"JupyterLite"}get appLicensesUrl(){return n.URLExt.join(n.PageConfig.getBaseUrl(),"build",r)}get labExtensionsUrl(){return n.PageConfig.getOption("fullLabextensionsUrl")}async _getAppLicenses(){let e=c;try{e=(await fetch(this.appLicensesUrl)).json()}catch(e){console.warn("Could not resolve licenses for",this.appName)}return e}async _getFederated(){const e={};let t;try{t=JSON.parse(n.PageConfig.getOption("federated_extensions"))}catch{return e}const s=[];for(const n of t)s.push(this._getOneFederated(n,e));try{await Promise.all(s)}catch(e){console.warn("Error resolving licenses",e)}return e}async _getOneFederated(e,t){try{const s=n.URLExt.join(this.labExtensionsUrl,e.name,"static",r),a=await fetch(s);t[e.name]=await a.json()}catch{console.warn("Could not resolve licenses for",e),t[e.name]=c}}}}}]);
//# sourceMappingURL=5597.2cc7076.js.map