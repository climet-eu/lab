var _JUPYTERLAB;(()=>{"use strict";var e,r,t,n,o,i,a,l,u,f,s,d,p,c,h,v,g={752:(e,r,t)=>{var n={"./index":()=>t.e(389).then((()=>()=>t(389))),"./extension":()=>t.e(389).then((()=>()=>t(389))),"./style":()=>t.e(747).then((()=>()=>t(747)))},o=(e,r)=>(t.R=r,r=t.o(n,e)?n[e]():Promise.resolve().then((()=>{throw new Error('Module "'+e+'" does not exist in container.')})),t.R=void 0,r),i=(e,r)=>{if(t.S){var n="default",o=t.S[n];if(o&&o!==e)throw new Error("Container initialization failed as it has already been initialized with a different share scope");return t.S[n]=e,t.I(n,r)}};t.d(r,{get:()=>o,init:()=>i})}},y={};function b(e){var r=y[e];if(void 0!==r)return r.exports;var t=y[e]={id:e,exports:{}};return g[e](t,t.exports,b),t.exports}b.m=g,b.c=y,b.n=e=>{var r=e&&e.__esModule?()=>e.default:()=>e;return b.d(r,{a:r}),r},b.d=(e,r)=>{for(var t in r)b.o(r,t)&&!b.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:r[t]})},b.f={},b.e=e=>Promise.all(Object.keys(b.f).reduce(((r,t)=>(b.f[t](e,r),r)),[])),b.u=e=>e+"."+{389:"08b22fc34e4e1261c9c7",747:"be821cd0b51de1516504"}[e]+".js?v="+{389:"08b22fc34e4e1261c9c7",747:"be821cd0b51de1516504"}[e],b.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),b.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),e={},r="@jupyterlite/litegitpuller:",b.l=(t,n,o,i)=>{if(e[t])e[t].push(n);else{var a,l;if(void 0!==o)for(var u=document.getElementsByTagName("script"),f=0;f<u.length;f++){var s=u[f];if(s.getAttribute("src")==t||s.getAttribute("data-webpack")==r+o){a=s;break}}a||(l=!0,(a=document.createElement("script")).charset="utf-8",a.timeout=120,b.nc&&a.setAttribute("nonce",b.nc),a.setAttribute("data-webpack",r+o),a.src=t),e[t]=[n];var d=(r,n)=>{a.onerror=a.onload=null,clearTimeout(p);var o=e[t];if(delete e[t],a.parentNode&&a.parentNode.removeChild(a),o&&o.forEach((e=>e(n))),r)return r(n)},p=setTimeout(d.bind(null,void 0,{type:"timeout",target:a}),12e4);a.onerror=d.bind(null,a.onerror),a.onload=d.bind(null,a.onload),l&&document.head.appendChild(a)}},b.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{b.S={};var e={},r={};b.I=(t,n)=>{n||(n=[]);var o=r[t];if(o||(o=r[t]={}),!(n.indexOf(o)>=0)){if(n.push(o),e[t])return e[t];b.o(b.S,t)||(b.S[t]={});var i=b.S[t],a="@jupyterlite/litegitpuller",l=[];return"default"===t&&((e,r,t,n)=>{var o=i[e]=i[e]||{},l=o[r];(!l||!l.loaded&&(1!=!l.eager?n:a>l.from))&&(o[r]={get:()=>b.e(389).then((()=>()=>b(389))),from:a,eager:!1})})("@jupyterlite/litegitpuller","0.3.0"),e[t]=l.length?Promise.all(l).then((()=>e[t]=1)):1}}})(),(()=>{var e;b.g.importScripts&&(e=b.g.location+"");var r=b.g.document;if(!e&&r&&(r.currentScript&&(e=r.currentScript.src),!e)){var t=r.getElementsByTagName("script");if(t.length)for(var n=t.length-1;n>-1&&!e;)e=t[n--].src}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),b.p=e})(),t=e=>{var r=e=>e.split(".").map((e=>+e==e?+e:e)),t=/^([^-+]+)?(?:-([^+]+))?(?:\+(.+))?$/.exec(e),n=t[1]?r(t[1]):[];return t[2]&&(n.length++,n.push.apply(n,r(t[2]))),t[3]&&(n.push([]),n.push.apply(n,r(t[3]))),n},n=(e,r)=>{e=t(e),r=t(r);for(var n=0;;){if(n>=e.length)return n<r.length&&"u"!=(typeof r[n])[0];var o=e[n],i=(typeof o)[0];if(n>=r.length)return"u"==i;var a=r[n],l=(typeof a)[0];if(i!=l)return"o"==i&&"n"==l||"s"==l||"u"==i;if("o"!=i&&"u"!=i&&o!=a)return o<a;n++}},o=e=>{var r=e[0],t="";if(1===e.length)return"*";if(r+.5){t+=0==r?">=":-1==r?"<":1==r?"^":2==r?"~":r>0?"=":"!=";for(var n=1,i=1;i<e.length;i++)n--,t+="u"==(typeof(l=e[i]))[0]?"-":(n>0?".":"")+(n=2,l);return t}var a=[];for(i=1;i<e.length;i++){var l=e[i];a.push(0===l?"not("+u()+")":1===l?"("+u()+" || "+u()+")":2===l?a.pop()+" "+a.pop():o(l))}return u();function u(){return a.pop().replace(/^\((.+)\)$/,"$1")}},i=(e,r)=>{if(0 in e){r=t(r);var n=e[0],o=n<0;o&&(n=-n-1);for(var a=0,l=1,u=!0;;l++,a++){var f,s,d=l<e.length?(typeof e[l])[0]:"";if(a>=r.length||"o"==(s=(typeof(f=r[a]))[0]))return!u||("u"==d?l>n&&!o:""==d!=o);if("u"==s){if(!u||"u"!=d)return!1}else if(u)if(d==s)if(l<=n){if(f!=e[l])return!1}else{if(o?f>e[l]:f<e[l])return!1;f!=e[l]&&(u=!1)}else if("s"!=d&&"n"!=d){if(o||l<=n)return!1;u=!1,l--}else{if(l<=n||s<d!=o)return!1;u=!1}else"s"!=d&&"n"!=d&&(u=!1,l--)}}var p=[],c=p.pop.bind(p);for(a=1;a<e.length;a++){var h=e[a];p.push(1==h?c()|c():2==h?c()&c():h?i(h,r):!c())}return!!c()},a=(e,r)=>{var t=b.S[e];if(!t||!b.o(t,r))throw new Error("Shared module "+r+" doesn't exist in shared scope "+e);return t},l=(e,r)=>{var t=e[r];return Object.keys(t).reduce(((e,r)=>!e||!t[e].loaded&&n(e,r)?r:e),0)},u=(e,r,t,n)=>"Unsatisfied version "+t+" from "+(t&&e[r][t].from)+" of shared singleton module "+r+" (required "+o(n)+")",f=(e,r,t,n)=>{var o=l(e,t);return i(n,o)||s(u(e,t,o,n)),d(e[t][o])},s=e=>{"undefined"!=typeof console&&console.warn&&console.warn(e)},d=e=>(e.loaded=1,e.get()),p=(e=>function(r,t,n,o){var i=b.I(r);return i&&i.then?i.then(e.bind(e,r,b.S[r],t,n,o)):e(r,b.S[r],t,n)})(((e,r,t,n)=>(a(e,t),f(r,0,t,n)))),c={},h={262:()=>p("default","@jupyterlab/services",[1,7,3,1]),613:()=>p("default","@jupyterlab/filebrowser",[1,4,3,1]),714:()=>p("default","@jupyterlab/coreutils",[1,6,3,1])},v={389:[262,613,714]},b.f.consumes=(e,r)=>{b.o(v,e)&&v[e].forEach((e=>{if(b.o(c,e))return r.push(c[e]);var t=r=>{c[e]=0,b.m[e]=t=>{delete b.c[e],t.exports=r()}},n=r=>{delete c[e],b.m[e]=t=>{throw delete b.c[e],r}};try{var o=h[e]();o.then?r.push(c[e]=o.then(t).catch(n)):t(o)}catch(e){n(e)}}))},(()=>{var e={422:0};b.f.j=(r,t)=>{var n=b.o(e,r)?e[r]:void 0;if(0!==n)if(n)t.push(n[2]);else{var o=new Promise(((t,o)=>n=e[r]=[t,o]));t.push(n[2]=o);var i=b.p+b.u(r),a=new Error;b.l(i,(t=>{if(b.o(e,r)&&(0!==(n=e[r])&&(e[r]=void 0),n)){var o=t&&("load"===t.type?"missing":t.type),i=t&&t.target&&t.target.src;a.message="Loading chunk "+r+" failed.\n("+o+": "+i+")",a.name="ChunkLoadError",a.type=o,a.request=i,n[1](a)}}),"chunk-"+r,r)}};var r=(r,t)=>{var n,o,[i,a,l]=t,u=0;if(i.some((r=>0!==e[r]))){for(n in a)b.o(a,n)&&(b.m[n]=a[n]);l&&l(b)}for(r&&r(t);u<i.length;u++)o=i[u],b.o(e,o)&&e[o]&&e[o][0](),e[o]=0},t=self.webpackChunk_jupyterlite_litegitpuller=self.webpackChunk_jupyterlite_litegitpuller||[];t.forEach(r.bind(null,0)),t.push=r.bind(null,t.push.bind(t))})(),b.nc=void 0;var m=b(752);(_JUPYTERLAB=void 0===_JUPYTERLAB?{}:_JUPYTERLAB)["@jupyterlite/litegitpuller"]=m})();