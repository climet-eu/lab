"use strict";(self.webpackChunk_JUPYTERLAB_CORE_OUTPUT=self.webpackChunk_JUPYTERLAB_CORE_OUTPUT||[]).push([[5261],{25261:(e,t,r)=>{r.r(t),r.d(t,{RegExpCursor:()=>u,SearchCursor:()=>l,SearchQuery:()=>W,closeSearchPanel:()=>ae,findNext:()=>G,findPrevious:()=>H,getSearchQuery:()=>_,gotoLine:()=>y,highlightSelectionMatches:()=>C,openSearchPanel:()=>se,replaceAll:()=>te,replaceNext:()=>ee,search:()=>A,searchKeymap:()=>le,searchPanelOpen:()=>N,selectMatches:()=>X,selectNextOccurrence:()=>L,selectSelectionMatches:()=>Z,setSearchQuery:()=>$});var i=r(64357),n=r(5315);function o(){var e=arguments[0];"string"==typeof e&&(e=document.createElement(e));var t=1,r=arguments[1];if(r&&"object"==typeof r&&null==r.nodeType&&!Array.isArray(r)){for(var i in r)if(Object.prototype.hasOwnProperty.call(r,i)){var n=r[i];"string"==typeof n?e.setAttribute(i,n):null!=n&&(e[i]=n)}t++}for(;t<arguments.length;t++)s(e,arguments[t]);return e}function s(e,t){if("string"==typeof t)e.appendChild(document.createTextNode(t));else if(null==t);else if(null!=t.nodeType)e.appendChild(t);else{if(!Array.isArray(t))throw new RangeError("Unsupported child node: "+t);for(var r=0;r<t.length;r++)s(e,t[r])}}const a="function"==typeof String.prototype.normalize?e=>e.normalize("NFKD"):e=>e;class l{constructor(e,t,r=0,i=e.length,n,o){this.test=o,this.value={from:0,to:0},this.done=!1,this.matches=[],this.buffer="",this.bufferPos=0,this.iter=e.iterRange(r,i),this.bufferStart=r,this.normalize=n?e=>n(a(e)):a,this.query=this.normalize(t)}peek(){if(this.bufferPos==this.buffer.length){if(this.bufferStart+=this.buffer.length,this.iter.next(),this.iter.done)return-1;this.bufferPos=0,this.buffer=this.iter.value}return(0,n.codePointAt)(this.buffer,this.bufferPos)}next(){for(;this.matches.length;)this.matches.pop();return this.nextOverlapping()}nextOverlapping(){for(;;){let e=this.peek();if(e<0)return this.done=!0,this;let t=(0,n.fromCodePoint)(e),r=this.bufferStart+this.bufferPos;this.bufferPos+=(0,n.codePointSize)(e);let i=this.normalize(t);if(i.length)for(let e=0,n=r;;e++){let o=i.charCodeAt(e),s=this.match(o,n,this.bufferPos+this.bufferStart);if(e==i.length-1){if(s)return this.value=s,this;break}n==r&&e<t.length&&t.charCodeAt(e)==o&&n++}}}match(e,t,r){let i=null;for(let t=0;t<this.matches.length;t+=2){let n=this.matches[t],o=!1;this.query.charCodeAt(n)==e&&(n==this.query.length-1?i={from:this.matches[t+1],to:r}:(this.matches[t]++,o=!0)),o||(this.matches.splice(t,2),t-=2)}return this.query.charCodeAt(0)==e&&(1==this.query.length?i={from:t,to:r}:this.matches.push(1,t)),i&&this.test&&!this.test(i.from,i.to,this.buffer,this.bufferStart)&&(i=null),i}}"undefined"!=typeof Symbol&&(l.prototype[Symbol.iterator]=function(){return this});const c={from:-1,to:-1,match:/.*/.exec("")},h="gm"+(null==/x/.unicode?"":"u");class u{constructor(e,t,r,i=0,n=e.length){if(this.text=e,this.to=n,this.curLine="",this.done=!1,this.value=c,/\\[sWDnr]|\n|\r|\[\^/.test(t))return new m(e,t,r,i,n);this.re=new RegExp(t,h+((null==r?void 0:r.ignoreCase)?"i":"")),this.test=null==r?void 0:r.test,this.iter=e.iter();let o=e.lineAt(i);this.curLineStart=o.from,this.matchPos=p(e,i),this.getLine(this.curLineStart)}getLine(e){this.iter.next(e),this.iter.lineBreak?this.curLine="":(this.curLine=this.iter.value,this.curLineStart+this.curLine.length>this.to&&(this.curLine=this.curLine.slice(0,this.to-this.curLineStart)),this.iter.next())}nextLine(){this.curLineStart=this.curLineStart+this.curLine.length+1,this.curLineStart>this.to?this.curLine="":this.getLine(0)}next(){for(let e=this.matchPos-this.curLineStart;;){this.re.lastIndex=e;let t=this.matchPos<=this.to&&this.re.exec(this.curLine);if(t){let r=this.curLineStart+t.index,i=r+t[0].length;if(this.matchPos=p(this.text,i+(r==i?1:0)),r==this.curLineStart+this.curLine.length&&this.nextLine(),(r<i||r>this.value.to)&&(!this.test||this.test(r,i,t)))return this.value={from:r,to:i,match:t},this;e=this.matchPos-this.curLineStart}else{if(!(this.curLineStart+this.curLine.length<this.to))return this.done=!0,this;this.nextLine(),e=0}}}}const f=new WeakMap;class d{constructor(e,t){this.from=e,this.text=t}get to(){return this.from+this.text.length}static get(e,t,r){let i=f.get(e);if(!i||i.from>=r||i.to<=t){let i=new d(t,e.sliceString(t,r));return f.set(e,i),i}if(i.from==t&&i.to==r)return i;let{text:n,from:o}=i;return o>t&&(n=e.sliceString(t,o)+n,o=t),i.to<r&&(n+=e.sliceString(i.to,r)),f.set(e,new d(o,n)),new d(t,n.slice(t-o,r-o))}}class m{constructor(e,t,r,i,n){this.text=e,this.to=n,this.done=!1,this.value=c,this.matchPos=p(e,i),this.re=new RegExp(t,h+((null==r?void 0:r.ignoreCase)?"i":"")),this.test=null==r?void 0:r.test,this.flat=d.get(e,i,this.chunkEnd(i+5e3))}chunkEnd(e){return e>=this.to?this.to:this.text.lineAt(e).to}next(){for(;;){let e=this.re.lastIndex=this.matchPos-this.flat.from,t=this.re.exec(this.flat.text);if(t&&!t[0]&&t.index==e&&(this.re.lastIndex=e+1,t=this.re.exec(this.flat.text)),t){let e=this.flat.from+t.index,r=e+t[0].length;if((this.flat.to>=this.to||t.index+t[0].length<=this.flat.text.length-10)&&(!this.test||this.test(e,r,t)))return this.value={from:e,to:r,match:t},this.matchPos=p(this.text,r+(e==r?1:0)),this}if(this.flat.to==this.to)return this.done=!0,this;this.flat=d.get(this.text,this.flat.from,this.chunkEnd(this.flat.from+2*this.flat.text.length))}}}function p(e,t){if(t>=e.length)return t;let r,i=e.lineAt(t);for(;t<i.to&&(r=i.text.charCodeAt(t-i.from))>=56320&&r<57344;)t++;return t}function g(e){let t=o("input",{class:"cm-textfield",name:"line",value:String(e.state.doc.lineAt(e.state.selection.main.head).number)});function r(){let r=/^([+-])?(\d+)?(:\d+)?(%)?$/.exec(t.value);if(!r)return;let{state:o}=e,s=o.doc.lineAt(o.selection.main.head),[,a,l,c,h]=r,u=c?+c.slice(1):0,f=l?+l:s.number;if(l&&h){let e=f/100;a&&(e=e*("-"==a?-1:1)+s.number/o.doc.lines),f=Math.round(o.doc.lines*e)}else l&&a&&(f=f*("-"==a?-1:1)+s.number);let d=o.doc.line(Math.max(1,Math.min(o.doc.lines,f))),m=n.EditorSelection.cursor(d.from+Math.max(0,Math.min(u,d.length)));e.dispatch({effects:[v.of(!1),i.EditorView.scrollIntoView(m.from,{y:"center"})],selection:m}),e.focus()}return{dom:o("form",{class:"cm-gotoLine",onkeydown:t=>{27==t.keyCode?(t.preventDefault(),e.dispatch({effects:v.of(!1)}),e.focus()):13==t.keyCode&&(t.preventDefault(),r())},onsubmit:e=>{e.preventDefault(),r()}},o("label",e.state.phrase("Go to line"),": ",t)," ",o("button",{class:"cm-button",type:"submit"},e.state.phrase("go")))}}"undefined"!=typeof Symbol&&(u.prototype[Symbol.iterator]=m.prototype[Symbol.iterator]=function(){return this});const v=n.StateEffect.define(),x=n.StateField.define({create:()=>!0,update(e,t){for(let r of t.effects)r.is(v)&&(e=r.value);return e},provide:e=>i.showPanel.from(e,(e=>e?g:null))}),y=e=>{let t=(0,i.getPanel)(e,g);if(!t){let r=[v.of(!0)];null==e.state.field(x,!1)&&r.push(n.StateEffect.appendConfig.of([x,w])),e.dispatch({effects:r}),t=(0,i.getPanel)(e,g)}return t&&t.dom.querySelector("input").select(),!0},w=i.EditorView.baseTheme({".cm-panel.cm-gotoLine":{padding:"2px 6px 4px","& label":{fontSize:"80%"}}}),S={highlightWordAroundCursor:!1,minSelectionLength:1,maxMatches:100,wholeWords:!1},b=n.Facet.define({combine:e=>(0,n.combineConfig)(e,S,{highlightWordAroundCursor:(e,t)=>e||t,minSelectionLength:Math.min,maxMatches:Math.min})});function C(e){let t=[D,q];return e&&t.push(b.of(e)),t}const M=i.Decoration.mark({class:"cm-selectionMatch"}),k=i.Decoration.mark({class:"cm-selectionMatch cm-selectionMatch-main"});function E(e,t,r,i){return!(0!=r&&e(t.sliceDoc(r-1,r))==n.CharCategory.Word||i!=t.doc.length&&e(t.sliceDoc(i,i+1))==n.CharCategory.Word)}const q=i.ViewPlugin.fromClass(class{constructor(e){this.decorations=this.getDeco(e)}update(e){(e.selectionSet||e.docChanged||e.viewportChanged)&&(this.decorations=this.getDeco(e.view))}getDeco(e){let t=e.state.facet(b),{state:r}=e,o=r.selection;if(o.ranges.length>1)return i.Decoration.none;let s,a=o.main,c=null;if(a.empty){if(!t.highlightWordAroundCursor)return i.Decoration.none;let e=r.wordAt(a.head);if(!e)return i.Decoration.none;c=r.charCategorizer(a.head),s=r.sliceDoc(e.from,e.to)}else{let e=a.to-a.from;if(e<t.minSelectionLength||e>200)return i.Decoration.none;if(t.wholeWords){if(s=r.sliceDoc(a.from,a.to),c=r.charCategorizer(a.head),!E(c,r,a.from,a.to)||!function(e,t,r,i){return e(t.sliceDoc(r,r+1))==n.CharCategory.Word&&e(t.sliceDoc(i-1,i))==n.CharCategory.Word}(c,r,a.from,a.to))return i.Decoration.none}else if(s=r.sliceDoc(a.from,a.to),!s)return i.Decoration.none}let h=[];for(let n of e.visibleRanges){let e=new l(r.doc,s,n.from,n.to);for(;!e.next().done;){let{from:n,to:o}=e.value;if((!c||E(c,r,n,o))&&(a.empty&&n<=a.from&&o>=a.to?h.push(k.range(n,o)):(n>=a.to||o<=a.from)&&h.push(M.range(n,o)),h.length>t.maxMatches))return i.Decoration.none}}return i.Decoration.set(h)}},{decorations:e=>e.decorations}),D=i.EditorView.baseTheme({".cm-selectionMatch":{backgroundColor:"#99ff7780"},".cm-searchMatch .cm-selectionMatch":{backgroundColor:"transparent"}}),L=({state:e,dispatch:t})=>{let{ranges:r}=e.selection;if(r.some((e=>e.from===e.to)))return(({state:e,dispatch:t})=>{let{selection:r}=e,i=n.EditorSelection.create(r.ranges.map((t=>e.wordAt(t.head)||n.EditorSelection.cursor(t.head))),r.mainIndex);return!i.eq(r)&&(t(e.update({selection:i})),!0)})({state:e,dispatch:t});let o=e.sliceDoc(r[0].from,r[0].to);if(e.selection.ranges.some((t=>e.sliceDoc(t.from,t.to)!=o)))return!1;let s=function(e,t){let{main:r,ranges:i}=e.selection,n=e.wordAt(r.head),o=n&&n.from==r.from&&n.to==r.to;for(let r=!1,n=new l(e.doc,t,i[i.length-1].to);;){if(n.next(),!n.done){if(r&&i.some((e=>e.from==n.value.from)))continue;if(o){let t=e.wordAt(n.value.from);if(!t||t.from!=n.value.from||t.to!=n.value.to)continue}return n.value}if(r)return null;n=new l(e.doc,t,0,Math.max(0,i[i.length-1].from-1)),r=!0}}(e,o);return!!s&&(t(e.update({selection:e.selection.addRange(n.EditorSelection.range(s.from,s.to),!1),effects:i.EditorView.scrollIntoView(s.to)})),!0)},P=n.Facet.define({combine:e=>(0,n.combineConfig)(e,{top:!1,caseSensitive:!1,literal:!1,regexp:!1,wholeWord:!1,createPanel:e=>new ce(e),scrollToMatch:e=>i.EditorView.scrollIntoView(e)})});function A(e){return e?[P.of(e),pe]:pe}class W{constructor(e){this.search=e.search,this.caseSensitive=!!e.caseSensitive,this.literal=!!e.literal,this.regexp=!!e.regexp,this.replace=e.replace||"",this.valid=!!this.search&&(!this.regexp||function(e){try{return new RegExp(e,h),!0}catch(e){return!1}}(this.search)),this.unquoted=this.unquote(this.search),this.wholeWord=!!e.wholeWord}unquote(e){return this.literal?e:e.replace(/\\([nrt\\])/g,((e,t)=>"n"==t?"\n":"r"==t?"\r":"t"==t?"\t":"\\"))}eq(e){return this.search==e.search&&this.replace==e.replace&&this.caseSensitive==e.caseSensitive&&this.regexp==e.regexp&&this.wholeWord==e.wholeWord}create(){return this.regexp?new z(this):new T(this)}getCursor(e,t=0,r){let i=e.doc?e:n.EditorState.create({doc:e});return null==r&&(r=i.doc.length),this.regexp?O(this,i,t,r):R(this,i,t,r)}}class F{constructor(e){this.spec=e}}function R(e,t,r,i){return new l(t.doc,e.unquoted,r,i,e.caseSensitive?void 0:e=>e.toLowerCase(),e.wholeWord?(o=t.doc,s=t.charCategorizer(t.selection.main.head),(e,t,r,i)=>((i>e||i+r.length<t)&&(i=Math.max(0,e-2),r=o.sliceString(i,Math.min(o.length,t+2))),!(s(V(r,e-i))==n.CharCategory.Word&&s(I(r,e-i))==n.CharCategory.Word||s(I(r,t-i))==n.CharCategory.Word&&s(V(r,t-i))==n.CharCategory.Word))):void 0);var o,s}class T extends F{constructor(e){super(e)}nextMatch(e,t,r){let i=R(this.spec,e,r,e.doc.length).nextOverlapping();if(i.done){let r=Math.min(e.doc.length,t+this.spec.unquoted.length);i=R(this.spec,e,0,r).nextOverlapping()}return i.done||i.value.from==t&&i.value.to==r?null:i.value}prevMatchInRange(e,t,r){for(let i=r;;){let r=Math.max(t,i-1e4-this.spec.unquoted.length),n=R(this.spec,e,r,i),o=null;for(;!n.nextOverlapping().done;)o=n.value;if(o)return o;if(r==t)return null;i-=1e4}}prevMatch(e,t,r){let i=this.prevMatchInRange(e,0,t);return i||(i=this.prevMatchInRange(e,Math.max(0,r-this.spec.unquoted.length),e.doc.length)),!i||i.from==t&&i.to==r?null:i}getReplacement(e){return this.spec.unquote(this.spec.replace)}matchAll(e,t){let r=R(this.spec,e,0,e.doc.length),i=[];for(;!r.next().done;){if(i.length>=t)return null;i.push(r.value)}return i}highlight(e,t,r,i){let n=R(this.spec,e,Math.max(0,t-this.spec.unquoted.length),Math.min(r+this.spec.unquoted.length,e.doc.length));for(;!n.next().done;)i(n.value.from,n.value.to)}}function O(e,t,r,i){return new u(t.doc,e.search,{ignoreCase:!e.caseSensitive,test:e.wholeWord?(o=t.charCategorizer(t.selection.main.head),(e,t,r)=>!r[0].length||(o(V(r.input,r.index))!=n.CharCategory.Word||o(I(r.input,r.index))!=n.CharCategory.Word)&&(o(I(r.input,r.index+r[0].length))!=n.CharCategory.Word||o(V(r.input,r.index+r[0].length))!=n.CharCategory.Word)):void 0},r,i);var o}function V(e,t){return e.slice((0,n.findClusterBreak)(e,t,!1),t)}function I(e,t){return e.slice(t,(0,n.findClusterBreak)(e,t))}class z extends F{nextMatch(e,t,r){let i=O(this.spec,e,r,e.doc.length).next();return i.done&&(i=O(this.spec,e,0,t).next()),i.done?null:i.value}prevMatchInRange(e,t,r){for(let i=1;;i++){let n=Math.max(t,r-1e4*i),o=O(this.spec,e,n,r),s=null;for(;!o.next().done;)s=o.value;if(s&&(n==t||s.from>n+10))return s;if(n==t)return null}}prevMatch(e,t,r){return this.prevMatchInRange(e,0,t)||this.prevMatchInRange(e,r,e.doc.length)}getReplacement(e){return this.spec.unquote(this.spec.replace).replace(/\$([$&\d+])/g,((t,r)=>"$"==r?"$":"&"==r?e.match[0]:"0"!=r&&+r<e.match.length?e.match[r]:t))}matchAll(e,t){let r=O(this.spec,e,0,e.doc.length),i=[];for(;!r.next().done;){if(i.length>=t)return null;i.push(r.value)}return i}highlight(e,t,r,i){let n=O(this.spec,e,Math.max(0,t-250),Math.min(r+250,e.doc.length));for(;!n.next().done;)i(n.value.from,n.value.to)}}const $=n.StateEffect.define(),U=n.StateEffect.define(),B=n.StateField.define({create:e=>new Q(ie(e).create(),null),update(e,t){for(let r of t.effects)r.is($)?e=new Q(r.value.create(),e.panel):r.is(U)&&(e=new Q(e.query,r.value?re:null));return e},provide:e=>i.showPanel.from(e,(e=>e.panel))});function _(e){let t=e.field(B,!1);return t?t.query.spec:ie(e)}function N(e){var t;return null!=(null===(t=e.field(B,!1))||void 0===t?void 0:t.panel)}class Q{constructor(e,t){this.query=e,this.panel=t}}const K=i.Decoration.mark({class:"cm-searchMatch"}),j=i.Decoration.mark({class:"cm-searchMatch cm-searchMatch-selected"}),J=i.ViewPlugin.fromClass(class{constructor(e){this.view=e,this.decorations=this.highlight(e.state.field(B))}update(e){let t=e.state.field(B);(t!=e.startState.field(B)||e.docChanged||e.selectionSet||e.viewportChanged)&&(this.decorations=this.highlight(t))}highlight({query:e,panel:t}){if(!t||!e.spec.valid)return i.Decoration.none;let{view:r}=this,o=new n.RangeSetBuilder;for(let t=0,i=r.visibleRanges,n=i.length;t<n;t++){let{from:s,to:a}=i[t];for(;t<n-1&&a>i[t+1].from-500;)a=i[++t].to;e.highlight(r.state,s,a,((e,t)=>{let i=r.state.selection.ranges.some((r=>r.from==e&&r.to==t));o.add(e,t,i?j:K)}))}return o.finish()}},{decorations:e=>e.decorations});function Y(e){return t=>{let r=t.state.field(B,!1);return r&&r.query.spec.valid?e(t,r):se(t)}}const G=Y(((e,{query:t})=>{let{to:r}=e.state.selection.main,i=t.nextMatch(e.state,r,r);if(!i)return!1;let o=n.EditorSelection.single(i.from,i.to),s=e.state.facet(P);return e.dispatch({selection:o,effects:[de(e,i),s.scrollToMatch(o.main,e)],userEvent:"select.search"}),oe(e),!0})),H=Y(((e,{query:t})=>{let{state:r}=e,{from:i}=r.selection.main,o=t.prevMatch(r,i,i);if(!o)return!1;let s=n.EditorSelection.single(o.from,o.to),a=e.state.facet(P);return e.dispatch({selection:s,effects:[de(e,o),a.scrollToMatch(s.main,e)],userEvent:"select.search"}),oe(e),!0})),X=Y(((e,{query:t})=>{let r=t.matchAll(e.state,1e3);return!(!r||!r.length||(e.dispatch({selection:n.EditorSelection.create(r.map((e=>n.EditorSelection.range(e.from,e.to)))),userEvent:"select.search.matches"}),0))})),Z=({state:e,dispatch:t})=>{let r=e.selection;if(r.ranges.length>1||r.main.empty)return!1;let{from:i,to:o}=r.main,s=[],a=0;for(let t=new l(e.doc,e.sliceDoc(i,o));!t.next().done;){if(s.length>1e3)return!1;t.value.from==i&&(a=s.length),s.push(n.EditorSelection.range(t.value.from,t.value.to))}return t(e.update({selection:n.EditorSelection.create(s,a),userEvent:"select.search.matches"})),!0},ee=Y(((e,{query:t})=>{let{state:r}=e,{from:o,to:s}=r.selection.main;if(r.readOnly)return!1;let a=t.nextMatch(r,o,o);if(!a)return!1;let l,c,h=a,u=[],f=[];if(h.from==o&&h.to==s&&(c=r.toText(t.getReplacement(h)),u.push({from:h.from,to:h.to,insert:c}),h=t.nextMatch(r,h.from,h.to),f.push(i.EditorView.announce.of(r.phrase("replaced match on line $",r.doc.lineAt(o).number)+"."))),h){let t=0==u.length||u[0].from>=a.to?0:a.to-a.from-c.length;l=n.EditorSelection.single(h.from-t,h.to-t),f.push(de(e,h)),f.push(r.facet(P).scrollToMatch(l.main,e))}return e.dispatch({changes:u,selection:l,effects:f,userEvent:"input.replace"}),!0})),te=Y(((e,{query:t})=>{if(e.state.readOnly)return!1;let r=t.matchAll(e.state,1e9).map((e=>{let{from:r,to:i}=e;return{from:r,to:i,insert:t.getReplacement(e)}}));if(!r.length)return!1;let n=e.state.phrase("replaced $ matches",r.length)+".";return e.dispatch({changes:r,effects:i.EditorView.announce.of(n),userEvent:"input.replace.all"}),!0}));function re(e){return e.state.facet(P).createPanel(e)}function ie(e,t){var r,i,n,o,s;let a=e.selection.main,l=a.empty||a.to>a.from+100?"":e.sliceDoc(a.from,a.to);if(t&&!l)return t;let c=e.facet(P);return new W({search:(null!==(r=null==t?void 0:t.literal)&&void 0!==r?r:c.literal)?l:l.replace(/\n/g,"\\n"),caseSensitive:null!==(i=null==t?void 0:t.caseSensitive)&&void 0!==i?i:c.caseSensitive,literal:null!==(n=null==t?void 0:t.literal)&&void 0!==n?n:c.literal,regexp:null!==(o=null==t?void 0:t.regexp)&&void 0!==o?o:c.regexp,wholeWord:null!==(s=null==t?void 0:t.wholeWord)&&void 0!==s?s:c.wholeWord})}function ne(e){let t=(0,i.getPanel)(e,re);return t&&t.dom.querySelector("[main-field]")}function oe(e){let t=ne(e);t&&t==e.root.activeElement&&t.select()}const se=e=>{let t=e.state.field(B,!1);if(t&&t.panel){let r=ne(e);if(r&&r!=e.root.activeElement){let i=ie(e.state,t.query.spec);i.valid&&e.dispatch({effects:$.of(i)}),r.focus(),r.select()}}else e.dispatch({effects:[U.of(!0),t?$.of(ie(e.state,t.query.spec)):n.StateEffect.appendConfig.of(pe)]});return!0},ae=e=>{let t=e.state.field(B,!1);if(!t||!t.panel)return!1;let r=(0,i.getPanel)(e,re);return r&&r.dom.contains(e.root.activeElement)&&e.focus(),e.dispatch({effects:U.of(!1)}),!0},le=[{key:"Mod-f",run:se,scope:"editor search-panel"},{key:"F3",run:G,shift:H,scope:"editor search-panel",preventDefault:!0},{key:"Mod-g",run:G,shift:H,scope:"editor search-panel",preventDefault:!0},{key:"Escape",run:ae,scope:"editor search-panel"},{key:"Mod-Shift-l",run:Z},{key:"Mod-Alt-g",run:y},{key:"Mod-d",run:L,preventDefault:!0}];class ce{constructor(e){this.view=e;let t=this.query=e.state.field(B).query.spec;function r(e,t,r){return o("button",{class:"cm-button",name:e,onclick:t,type:"button"},r)}this.commit=this.commit.bind(this),this.searchField=o("input",{value:t.search,placeholder:he(e,"Find"),"aria-label":he(e,"Find"),class:"cm-textfield",name:"search",form:"","main-field":"true",onchange:this.commit,onkeyup:this.commit}),this.replaceField=o("input",{value:t.replace,placeholder:he(e,"Replace"),"aria-label":he(e,"Replace"),class:"cm-textfield",name:"replace",form:"",onchange:this.commit,onkeyup:this.commit}),this.caseField=o("input",{type:"checkbox",name:"case",form:"",checked:t.caseSensitive,onchange:this.commit}),this.reField=o("input",{type:"checkbox",name:"re",form:"",checked:t.regexp,onchange:this.commit}),this.wordField=o("input",{type:"checkbox",name:"word",form:"",checked:t.wholeWord,onchange:this.commit}),this.dom=o("div",{onkeydown:e=>this.keydown(e),class:"cm-search"},[this.searchField,r("next",(()=>G(e)),[he(e,"next")]),r("prev",(()=>H(e)),[he(e,"previous")]),r("select",(()=>X(e)),[he(e,"all")]),o("label",null,[this.caseField,he(e,"match case")]),o("label",null,[this.reField,he(e,"regexp")]),o("label",null,[this.wordField,he(e,"by word")]),...e.state.readOnly?[]:[o("br"),this.replaceField,r("replace",(()=>ee(e)),[he(e,"replace")]),r("replaceAll",(()=>te(e)),[he(e,"replace all")])],o("button",{name:"close",onclick:()=>ae(e),"aria-label":he(e,"close"),type:"button"},["×"])])}commit(){let e=new W({search:this.searchField.value,caseSensitive:this.caseField.checked,regexp:this.reField.checked,wholeWord:this.wordField.checked,replace:this.replaceField.value});e.eq(this.query)||(this.query=e,this.view.dispatch({effects:$.of(e)}))}keydown(e){(0,i.runScopeHandlers)(this.view,e,"search-panel")?e.preventDefault():13==e.keyCode&&e.target==this.searchField?(e.preventDefault(),(e.shiftKey?H:G)(this.view)):13==e.keyCode&&e.target==this.replaceField&&(e.preventDefault(),ee(this.view))}update(e){for(let t of e.transactions)for(let e of t.effects)e.is($)&&!e.value.eq(this.query)&&this.setQuery(e.value)}setQuery(e){this.query=e,this.searchField.value=e.search,this.replaceField.value=e.replace,this.caseField.checked=e.caseSensitive,this.reField.checked=e.regexp,this.wordField.checked=e.wholeWord}mount(){this.searchField.select()}get pos(){return 80}get top(){return this.view.state.facet(P).top}}function he(e,t){return e.state.phrase(t)}const ue=30,fe=/[\s\.,:;?!]/;function de(e,{from:t,to:r}){let n=e.state.doc.lineAt(t),o=e.state.doc.lineAt(r).to,s=Math.max(n.from,t-ue),a=Math.min(o,r+ue),l=e.state.sliceDoc(s,a);if(s!=n.from)for(let e=0;e<ue;e++)if(!fe.test(l[e+1])&&fe.test(l[e])){l=l.slice(e);break}if(a!=o)for(let e=l.length-1;e>l.length-ue;e--)if(!fe.test(l[e-1])&&fe.test(l[e])){l=l.slice(0,e);break}return i.EditorView.announce.of(`${e.state.phrase("current match")}. ${l} ${e.state.phrase("on line")} ${n.number}.`)}const me=i.EditorView.baseTheme({".cm-panel.cm-search":{padding:"2px 6px 4px",position:"relative","& [name=close]":{position:"absolute",top:"0",right:"4px",backgroundColor:"inherit",border:"none",font:"inherit",padding:0,margin:0},"& input, & button, & label":{margin:".2em .6em .2em 0"},"& input[type=checkbox]":{marginRight:".2em"},"& label":{fontSize:"80%",whiteSpace:"pre"}},"&light .cm-searchMatch":{backgroundColor:"#ffff0054"},"&dark .cm-searchMatch":{backgroundColor:"#00ffff8a"},"&light .cm-searchMatch-selected":{backgroundColor:"#ff6a0054"},"&dark .cm-searchMatch-selected":{backgroundColor:"#ff00ff8a"}}),pe=[B,n.Prec.low(J),me]}}]);
//# sourceMappingURL=5261.00cce9e.js.map