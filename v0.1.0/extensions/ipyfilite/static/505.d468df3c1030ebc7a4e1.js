(()=>{"use strict";var e={505:(e,t)=>{const n=new Map;self.onmessage=e=>{var t;n.set(e.data.url,{name:e.data.name,stream:(t=e.data.channel,new ReadableStream({start(e){t.onmessage=t=>{if(t.data.kind,"close"===t.data.kind)return e.close();if("abort"===t.data.kind&&e.error("The download has been aborted"),"chunk"===t.data.kind){const n=new Uint8Array(t.data.chunk);e.enqueue(n)}},t.start()},cancel(e){t.postMessage({kind:"abort"}),t.close()}}))}),e.data.channel.postMessage({kind:"ready"}),setTimeout((()=>n.delete(e.data.url)),4e4)},self.onfetch=e=>{const t=n.get(e.request.url);if(void 0===t)return null;const{name:r,stream:a}=t,o=encodeURIComponent(r).replace(/['()*]/g,(e=>`%${e.charCodeAt(0).toString(16).toUpperCase()}`)).replace(/%(7C|60|5E)/g,((e,t)=>String.fromCharCode(parseInt(t,16))));n.delete(e.request.url);const s=new Headers({"Content-Type":"application/octet-stream; charset=utf-8","Content-Disposition":"attachment; filename*=UTF-8''"+o,"Content-Security-Policy":"default-src 'none'","X-Content-Security-Policy":"default-src 'none'","X-WebKit-CSP":"default-src 'none'","X-XSS-Protection":"1; mode=block","Cross-Origin-Embedder-Policy":"require-corp"});e.respondWith(new Response(a,{headers:s}))}}},t={};function n(r){var a=t[r];if(void 0!==a)return a.exports;var o=t[r]={exports:{}};return e[r](o,o.exports,n),o.exports}n.m=e,n.c=t,n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{n.S={};var e={},t={};n.I=(r,a)=>{a||(a=[]);var o=t[r];if(o||(o=t[r]={}),!(a.indexOf(o)>=0)){if(a.push(o),e[r])return e[r];n.o(n.S,r)||(n.S[r]={}),n.S[r];var s=[];return e[r]=s.length?Promise.all(s).then((()=>e[r]=1)):1}}})(),n(505)})();