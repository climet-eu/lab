var _JUPYTERLAB;(()=>{"use strict";var e,t,r,n,o,a,i,l,u,f,d,s,p,c,b,h,v,m,y,g,j,w={212:(e,t,r)=>{var n={"./index":()=>Promise.all([r.e(66),r.e(568)]).then((()=>()=>r(568))),"./extension":()=>r.e(66).then((()=>()=>r(66)))},o=(e,t)=>(r.R=t,t=r.o(n,e)?n[e]():Promise.resolve().then((()=>{throw new Error('Module "'+e+'" does not exist in container.')})),r.R=void 0,t),a=(e,t)=>{if(r.S){var n="default",o=r.S[n];if(o&&o!==e)throw new Error("Container initialization failed as it has already been initialized with a different share scope");return r.S[n]=e,r.I(n,t)}};r.d(t,{get:()=>o,init:()=>a})}},P={};function S(e){var t=P[e];if(void 0!==t)return t.exports;var r=P[e]={id:e,loaded:!1,exports:{}};return w[e](r,r.exports,S),r.loaded=!0,r.exports}S.m=w,S.c=P,S.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return S.d(t,{a:t}),t},t=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__,S.t=function(r,n){if(1&n&&(r=this(r)),8&n)return r;if("object"==typeof r&&r){if(4&n&&r.__esModule)return r;if(16&n&&"function"==typeof r.then)return r}var o=Object.create(null);S.r(o);var a={};e=e||[null,t({}),t([]),t(t)];for(var i=2&n&&r;"object"==typeof i&&!~e.indexOf(i);i=t(i))Object.getOwnPropertyNames(i).forEach((e=>a[e]=()=>r[e]));return a.default=()=>r,S.d(o,a),o},S.d=(e,t)=>{for(var r in t)S.o(t,r)&&!S.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},S.f={},S.e=e=>Promise.all(Object.keys(S.f).reduce(((t,r)=>(S.f[r](e,t),t)),[])),S.u=e=>e+"."+{66:"5b5b447015ad96683dba",248:"13cf660684e62ff4e955",568:"dc21321599dd8f484ec8",688:"f18dafab27bdb95b0eda",792:"7f1d09b4636ed0774177",831:"125aba023d9a77ea026c",848:"533531ab9458555b8d4c",871:"6272f5c09422ecce2b06"}[e]+".js?v="+{66:"5b5b447015ad96683dba",248:"13cf660684e62ff4e955",568:"dc21321599dd8f484ec8",688:"f18dafab27bdb95b0eda",792:"7f1d09b4636ed0774177",831:"125aba023d9a77ea026c",848:"533531ab9458555b8d4c",871:"6272f5c09422ecce2b06"}[e],S.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),S.hmd=e=>((e=Object.create(e)).children||(e.children=[]),Object.defineProperty(e,"exports",{enumerable:!0,set:()=>{throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+e.id)}}),e),S.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r={},n="@deathbeds/jupyterlab-fonts:",S.l=(e,t,o,a)=>{if(r[e])r[e].push(t);else{var i,l;if(void 0!==o)for(var u=document.getElementsByTagName("script"),f=0;f<u.length;f++){var d=u[f];if(d.getAttribute("src")==e||d.getAttribute("data-webpack")==n+o){i=d;break}}i||(l=!0,(i=document.createElement("script")).charset="utf-8",i.timeout=120,S.nc&&i.setAttribute("nonce",S.nc),i.setAttribute("data-webpack",n+o),i.src=e),r[e]=[t];var s=(t,n)=>{i.onerror=i.onload=null,clearTimeout(p);var o=r[e];if(delete r[e],i.parentNode&&i.parentNode.removeChild(i),o&&o.forEach((e=>e(n))),t)return t(n)},p=setTimeout(s.bind(null,void 0,{type:"timeout",target:i}),12e4);i.onerror=s.bind(null,i.onerror),i.onload=s.bind(null,i.onload),l&&document.head.appendChild(i)}},S.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{S.S={};var e={},t={};S.I=(r,n)=>{n||(n=[]);var o=t[r];if(o||(o=t[r]={}),!(n.indexOf(o)>=0)){if(n.push(o),e[r])return e[r];S.o(S.S,r)||(S.S[r]={});var a=S.S[r],i="@deathbeds/jupyterlab-fonts",l=(e,t,r,n)=>{var o=a[e]=a[e]||{},l=o[t];(!l||!l.loaded&&(!n!=!l.eager?n:i>l.from))&&(o[t]={get:r,from:i,eager:!!n})},u=[];return"default"===r&&(l("@deathbeds/jupyterlab-fonts","3.0.0",(()=>Promise.all([S.e(66),S.e(568)]).then((()=>()=>S(568))))),l("jss-preset-default","10.10.0",(()=>Promise.all([S.e(831),S.e(688)]).then((()=>()=>S(831))))),l("jss","10.10.0",(()=>Promise.all([S.e(871),S.e(792)]).then((()=>()=>S(871)))))),e[r]=u.length?Promise.all(u).then((()=>e[r]=1)):1}}})(),(()=>{var e;S.g.importScripts&&(e=S.g.location+"");var t=S.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var r=t.getElementsByTagName("script");if(r.length)for(var n=r.length-1;n>-1&&!e;)e=r[n--].src}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),S.p=e})(),o=e=>{var t=e=>e.split(".").map((e=>+e==e?+e:e)),r=/^([^-+]+)?(?:-([^+]+))?(?:\+(.+))?$/.exec(e),n=r[1]?t(r[1]):[];return r[2]&&(n.length++,n.push.apply(n,t(r[2]))),r[3]&&(n.push([]),n.push.apply(n,t(r[3]))),n},a=(e,t)=>{e=o(e),t=o(t);for(var r=0;;){if(r>=e.length)return r<t.length&&"u"!=(typeof t[r])[0];var n=e[r],a=(typeof n)[0];if(r>=t.length)return"u"==a;var i=t[r],l=(typeof i)[0];if(a!=l)return"o"==a&&"n"==l||"s"==l||"u"==a;if("o"!=a&&"u"!=a&&n!=i)return n<i;r++}},i=e=>{var t=e[0],r="";if(1===e.length)return"*";if(t+.5){r+=0==t?">=":-1==t?"<":1==t?"^":2==t?"~":t>0?"=":"!=";for(var n=1,o=1;o<e.length;o++)n--,r+="u"==(typeof(l=e[o]))[0]?"-":(n>0?".":"")+(n=2,l);return r}var a=[];for(o=1;o<e.length;o++){var l=e[o];a.push(0===l?"not("+u()+")":1===l?"("+u()+" || "+u()+")":2===l?a.pop()+" "+a.pop():i(l))}return u();function u(){return a.pop().replace(/^\((.+)\)$/,"$1")}},l=(e,t)=>{if(0 in e){t=o(t);var r=e[0],n=r<0;n&&(r=-r-1);for(var a=0,i=1,u=!0;;i++,a++){var f,d,s=i<e.length?(typeof e[i])[0]:"";if(a>=t.length||"o"==(d=(typeof(f=t[a]))[0]))return!u||("u"==s?i>r&&!n:""==s!=n);if("u"==d){if(!u||"u"!=s)return!1}else if(u)if(s==d)if(i<=r){if(f!=e[i])return!1}else{if(n?f>e[i]:f<e[i])return!1;f!=e[i]&&(u=!1)}else if("s"!=s&&"n"!=s){if(n||i<=r)return!1;u=!1,i--}else{if(i<=r||d<s!=n)return!1;u=!1}else"s"!=s&&"n"!=s&&(u=!1,i--)}}var p=[],c=p.pop.bind(p);for(a=1;a<e.length;a++){var b=e[a];p.push(1==b?c()|c():2==b?c()&c():b?l(b,t):!c())}return!!c()},u=(e,t)=>{var r=S.S[e];if(!r||!S.o(r,t))throw new Error("Shared module "+t+" doesn't exist in shared scope "+e);return r},f=(e,t)=>{var r=e[t];return Object.keys(r).reduce(((e,t)=>!e||!r[e].loaded&&a(e,t)?t:e),0)},d=(e,t,r,n)=>"Unsatisfied version "+r+" from "+(r&&e[t][r].from)+" of shared singleton module "+t+" (required "+i(n)+")",s=(e,t,r,n)=>{var o=f(e,r);return l(n,o)||c(d(e,r,o,n)),b(e[r][o])},p=(e,t,r)=>{var n=e[t];return(t=Object.keys(n).reduce(((e,t)=>!l(r,t)||e&&!a(e,t)?e:t),0))&&n[t]},c=e=>{"undefined"!=typeof console&&console.warn&&console.warn(e)},b=e=>(e.loaded=1,e.get()),v=(h=e=>function(t,r,n,o){var a=S.I(t);return a&&a.then?a.then(e.bind(e,t,S.S[t],r,n,o)):e(t,S.S[t],r,n,o)})(((e,t,r,n)=>(u(e,r),s(t,0,r,n)))),m=h(((e,t,r,n,o)=>{var a=t&&S.o(t,r)&&p(t,r,n);return a?b(a):o()})),y={},g={29:()=>v("default","react",[1,18,2,0]),85:()=>v("default","@jupyterlab/ui-components",[1,4,0,9]),122:()=>v("default","@jupyterlab/notebook",[1,4,0,9]),190:()=>v("default","@jupyterlab/settingregistry",[1,4,0,9]),205:()=>v("default","@jupyterlab/application",[1,4,0,9]),308:()=>v("default","@jupyterlab/apputils",[1,4,1,9]),409:()=>v("default","@jupyterlab/mainmenu",[1,4,0,9]),717:()=>v("default","@lumino/disposable",[1,2,0,0]),749:()=>v("default","@jupyterlab/coreutils",[1,6,0,9]),778:()=>v("default","@lumino/widgets",[1,2,0,1]),797:()=>v("default","@lumino/polling",[1,2,0,0]),901:()=>v("default","@lumino/signaling",[1,2,0,0]),930:()=>v("default","@lumino/coreutils",[1,2,0,0]),688:()=>m("default","jss",[4,10,10,0],(()=>S.e(871).then((()=>()=>S(871))))),248:()=>m("default","jss",[1,10,10,0],(()=>Promise.all([S.e(871),S.e(792)]).then((()=>()=>S(871))))),848:()=>m("default","jss-preset-default",[1,10,10,0],(()=>Promise.all([S.e(831),S.e(688)]).then((()=>()=>S(831)))))},j={66:[29,85,122,190,205,308,409,717,749,778,797,901,930],248:[248],688:[688],848:[848]},S.f.consumes=(e,t)=>{S.o(j,e)&&j[e].forEach((e=>{if(S.o(y,e))return t.push(y[e]);var r=t=>{y[e]=0,S.m[e]=r=>{delete S.c[e],r.exports=t()}},n=t=>{delete y[e],S.m[e]=r=>{throw delete S.c[e],t}};try{var o=g[e]();o.then?t.push(y[e]=o.then(r).catch(n)):r(o)}catch(e){n(e)}}))},(()=>{var e={717:0};S.f.j=(t,r)=>{var n=S.o(e,t)?e[t]:void 0;if(0!==n)if(n)r.push(n[2]);else if(/^(24|68|84)8$/.test(t))e[t]=0;else{var o=new Promise(((r,o)=>n=e[t]=[r,o]));r.push(n[2]=o);var a=S.p+S.u(t),i=new Error;S.l(a,(r=>{if(S.o(e,t)&&(0!==(n=e[t])&&(e[t]=void 0),n)){var o=r&&("load"===r.type?"missing":r.type),a=r&&r.target&&r.target.src;i.message="Loading chunk "+t+" failed.\n("+o+": "+a+")",i.name="ChunkLoadError",i.type=o,i.request=a,n[1](i)}}),"chunk-"+t,t)}};var t=(t,r)=>{var n,o,[a,i,l]=r,u=0;if(a.some((t=>0!==e[t]))){for(n in i)S.o(i,n)&&(S.m[n]=i[n]);l&&l(S)}for(t&&t(r);u<a.length;u++)o=a[u],S.o(e,o)&&e[o]&&e[o][0](),e[o]=0},r=self.webpackChunk_deathbeds_jupyterlab_fonts=self.webpackChunk_deathbeds_jupyterlab_fonts||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})(),S.nc=void 0;var E=S(212);(_JUPYTERLAB=void 0===_JUPYTERLAB?{}:_JUPYTERLAB)["@deathbeds/jupyterlab-fonts"]=E})();
//# sourceMappingURL=remoteEntry.90fd4745446ff9dd5871.js.map