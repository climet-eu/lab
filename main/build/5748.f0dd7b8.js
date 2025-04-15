"use strict";(self.webpackChunk_JUPYTERLAB_CORE_OUTPUT=self.webpackChunk_JUPYTERLAB_CORE_OUTPUT||[]).push([[5748],{80910:(t,e,r)=>{function n(t,e){t.accDescr&&e.setAccDescription?.(t.accDescr),t.accTitle&&e.setAccTitle?.(t.accTitle),t.title&&e.setDiagramTitle?.(t.title)}r.d(e,{A:()=>n}),(0,r(86906).eW)(n,"populateCommonDb")},82002:(t,e,r)=>{r.d(e,{A:()=>o});var n=r(86906),o=class{constructor(t){this.init=t,this.records=this.init()}static{(0,n.eW)(this,"ImperativeState")}reset(){this.records=this.init()}}},85748:(t,e,r)=>{r.d(e,{diagram:()=>ft});var n=r(80910),o=r(82002),a=r(42626),c=r(86906),s=r(13197),i=r(28098),h={NORMAL:0,REVERSE:1,HIGHLIGHT:2,MERGE:3,CHERRY_PICK:4},d=c.vZ.gitGraph,$=(0,c.eW)((()=>(0,a.Rb)({...d,...(0,c.iE)().gitGraph})),"getConfig"),m=new o.A((()=>{const t=$(),e=t.mainBranchName,r=t.mainBranchOrder;return{mainBranchName:e,commits:new Map,head:null,branchConfig:new Map([[e,{name:e,order:r}]]),branches:new Map([[e,null]]),currBranch:e,direction:"LR",seq:0,options:{}}}));function l(){return(0,a.MX)({length:7})}function g(t,e){const r=Object.create(null);return t.reduce(((t,n)=>{const o=e(n);return r[o]||(r[o]=!0,t.push(n)),t}),[])}(0,c.eW)(l,"getID"),(0,c.eW)(g,"uniqBy");var y=(0,c.eW)((function(t){m.records.direction=t}),"setDirection"),p=(0,c.eW)((function(t){c.cM.debug("options str",t),t=t?.trim(),t=t||"{}";try{m.records.options=JSON.parse(t)}catch(t){c.cM.error("error while parsing gitGraph options",t.message)}}),"setOptions"),x=(0,c.eW)((function(){return m.records.options}),"getOptions"),f=(0,c.eW)((function(t){let e=t.msg,r=t.id;const n=t.type;let o=t.tags;c.cM.info("commit",e,r,n,o),c.cM.debug("Entering commit:",e,r,n,o);const a=$();r=c.SY.sanitizeText(r,a),e=c.SY.sanitizeText(e,a),o=o?.map((t=>c.SY.sanitizeText(t,a)));const s={id:r||m.records.seq+"-"+l(),message:e,seq:m.records.seq++,type:n??h.NORMAL,tags:o??[],parents:null==m.records.head?[]:[m.records.head.id],branch:m.records.currBranch};m.records.head=s,c.cM.info("main branch",a.mainBranchName),m.records.commits.set(s.id,s),m.records.branches.set(m.records.currBranch,s.id),c.cM.debug("in pushCommit "+s.id)}),"commit"),u=(0,c.eW)((function(t){let e=t.name;const r=t.order;if(e=c.SY.sanitizeText(e,$()),m.records.branches.has(e))throw new Error(`Trying to create an existing branch. (Help: Either use a new name if you want create a new branch or try using "checkout ${e}")`);m.records.branches.set(e,null!=m.records.head?m.records.head.id:null),m.records.branchConfig.set(e,{name:e,order:r}),B(e),c.cM.debug("in createBranch")}),"branch"),b=(0,c.eW)((t=>{let e=t.branch,r=t.id;const n=t.type,o=t.tags,a=$();e=c.SY.sanitizeText(e,a),r&&(r=c.SY.sanitizeText(r,a));const s=m.records.branches.get(m.records.currBranch),i=m.records.branches.get(e),d=s?m.records.commits.get(s):void 0,g=i?m.records.commits.get(i):void 0;if(d&&g&&d.branch===e)throw new Error(`Cannot merge branch '${e}' into itself.`);if(m.records.currBranch===e){const t=new Error('Incorrect usage of "merge". Cannot merge a branch to itself');throw t.hash={text:`merge ${e}`,token:`merge ${e}`,expected:["branch abc"]},t}if(void 0===d||!d){const t=new Error(`Incorrect usage of "merge". Current branch (${m.records.currBranch})has no commits`);throw t.hash={text:`merge ${e}`,token:`merge ${e}`,expected:["commit"]},t}if(!m.records.branches.has(e)){const t=new Error('Incorrect usage of "merge". Branch to be merged ('+e+") does not exist");throw t.hash={text:`merge ${e}`,token:`merge ${e}`,expected:[`branch ${e}`]},t}if(void 0===g||!g){const t=new Error('Incorrect usage of "merge". Branch to be merged ('+e+") has no commits");throw t.hash={text:`merge ${e}`,token:`merge ${e}`,expected:['"commit"']},t}if(d===g){const t=new Error('Incorrect usage of "merge". Both branches have same head');throw t.hash={text:`merge ${e}`,token:`merge ${e}`,expected:["branch abc"]},t}if(r&&m.records.commits.has(r)){const t=new Error('Incorrect usage of "merge". Commit with id:'+r+" already exists, use different custom Id");throw t.hash={text:`merge ${e} ${r} ${n} ${o?.join(" ")}`,token:`merge ${e} ${r} ${n} ${o?.join(" ")}`,expected:[`merge ${e} ${r}_UNIQUE ${n} ${o?.join(" ")}`]},t}const y=i||"",p={id:r||`${m.records.seq}-${l()}`,message:`merged branch ${e} into ${m.records.currBranch}`,seq:m.records.seq++,parents:null==m.records.head?[]:[m.records.head.id,y],branch:m.records.currBranch,type:h.MERGE,customType:n,customId:!!r,tags:o??[]};m.records.head=p,m.records.commits.set(p.id,p),m.records.branches.set(m.records.currBranch,p.id),c.cM.debug(m.records.branches),c.cM.debug("in mergeBranch")}),"merge"),w=(0,c.eW)((function(t){let e=t.id,r=t.targetId,n=t.tags,o=t.parent;c.cM.debug("Entering cherryPick:",e,r,n);const a=$();if(e=c.SY.sanitizeText(e,a),r=c.SY.sanitizeText(r,a),n=n?.map((t=>c.SY.sanitizeText(t,a))),o=c.SY.sanitizeText(o,a),!e||!m.records.commits.has(e)){const t=new Error('Incorrect usage of "cherryPick". Source commit id should exist and provided');throw t.hash={text:`cherryPick ${e} ${r}`,token:`cherryPick ${e} ${r}`,expected:["cherry-pick abc"]},t}const s=m.records.commits.get(e);if(void 0===s||!s)throw new Error('Incorrect usage of "cherryPick". Source commit id should exist and provided');if(o&&(!Array.isArray(s.parents)||!s.parents.includes(o)))throw new Error("Invalid operation: The specified parent commit is not an immediate parent of the cherry-picked commit.");const i=s.branch;if(s.type===h.MERGE&&!o)throw new Error("Incorrect usage of cherry-pick: If the source commit is a merge commit, an immediate parent commit must be specified.");if(!r||!m.records.commits.has(r)){if(i===m.records.currBranch){const t=new Error('Incorrect usage of "cherryPick". Source commit is already on current branch');throw t.hash={text:`cherryPick ${e} ${r}`,token:`cherryPick ${e} ${r}`,expected:["cherry-pick abc"]},t}const t=m.records.branches.get(m.records.currBranch);if(void 0===t||!t){const t=new Error(`Incorrect usage of "cherry-pick". Current branch (${m.records.currBranch})has no commits`);throw t.hash={text:`cherryPick ${e} ${r}`,token:`cherryPick ${e} ${r}`,expected:["cherry-pick abc"]},t}const a=m.records.commits.get(t);if(void 0===a||!a){const t=new Error(`Incorrect usage of "cherry-pick". Current branch (${m.records.currBranch})has no commits`);throw t.hash={text:`cherryPick ${e} ${r}`,token:`cherryPick ${e} ${r}`,expected:["cherry-pick abc"]},t}const d={id:m.records.seq+"-"+l(),message:`cherry-picked ${s?.message} into ${m.records.currBranch}`,seq:m.records.seq++,parents:null==m.records.head?[]:[m.records.head.id,s.id],branch:m.records.currBranch,type:h.CHERRY_PICK,tags:n?n.filter(Boolean):[`cherry-pick:${s.id}${s.type===h.MERGE?`|parent:${o}`:""}`]};m.records.head=d,m.records.commits.set(d.id,d),m.records.branches.set(m.records.currBranch,d.id),c.cM.debug(m.records.branches),c.cM.debug("in cherryPick")}}),"cherryPick"),B=(0,c.eW)((function(t){if(t=c.SY.sanitizeText(t,$()),!m.records.branches.has(t)){const e=new Error(`Trying to checkout branch which is not yet created. (Help try using "branch ${t}")`);throw e.hash={text:`checkout ${t}`,token:`checkout ${t}`,expected:[`branch ${t}`]},e}{m.records.currBranch=t;const e=m.records.branches.get(m.records.currBranch);m.records.head=void 0!==e&&e?m.records.commits.get(e)??null:null}}),"checkout");function E(t,e,r){const n=t.indexOf(e);-1===n?t.push(r):t.splice(n,1,r)}function T(t){const e=t.reduce(((t,e)=>t.seq>e.seq?t:e),t[0]);let r="";t.forEach((function(t){r+=t===e?"\t*":"\t|"}));const n=[r,e.id,e.seq];for(const t in m.records.branches)m.records.branches.get(t)===e.id&&n.push(t);if(c.cM.debug(n.join(" ")),e.parents&&2==e.parents.length&&e.parents[0]&&e.parents[1]){const r=m.records.commits.get(e.parents[0]);E(t,e,r),e.parents[1]&&t.push(m.records.commits.get(e.parents[1]))}else{if(0==e.parents.length)return;if(e.parents[0]){const r=m.records.commits.get(e.parents[0]);E(t,e,r)}}T(t=g(t,(t=>t.id)))}(0,c.eW)(E,"upsert"),(0,c.eW)(T,"prettyPrintCommitHistory");var C=(0,c.eW)((function(){c.cM.debug(m.records.commits),T([v()[0]])}),"prettyPrint"),k=(0,c.eW)((function(){m.reset(),(0,c.ZH)()}),"clear"),M=(0,c.eW)((function(){return[...m.records.branchConfig.values()].map(((t,e)=>null!==t.order&&void 0!==t.order?t:{...t,order:parseFloat(`0.${e}`)})).sort(((t,e)=>(t.order??0)-(e.order??0))).map((({name:t})=>({name:t})))}),"getBranchesAsObjArray"),L=(0,c.eW)((function(){return m.records.branches}),"getBranches"),W=(0,c.eW)((function(){return m.records.commits}),"getCommits"),v=(0,c.eW)((function(){const t=[...m.records.commits.values()];return t.forEach((function(t){c.cM.debug(t.id)})),t.sort(((t,e)=>t.seq-e.seq)),t}),"getCommitsArray"),R={commitType:h,getConfig:$,setDirection:y,setOptions:p,getOptions:x,commit:f,branch:u,merge:b,cherryPick:w,checkout:B,prettyPrint:C,clear:k,getBranchesAsObjArray:M,getBranches:L,getCommits:W,getCommitsArray:v,getCurrentBranch:(0,c.eW)((function(){return m.records.currBranch}),"getCurrentBranch"),getDirection:(0,c.eW)((function(){return m.records.direction}),"getDirection"),getHead:(0,c.eW)((function(){return m.records.head}),"getHead"),setAccTitle:c.GN,getAccTitle:c.eu,getAccDescription:c.Mx,setAccDescription:c.U$,setDiagramTitle:c.g2,getDiagramTitle:c.Kr},P=(0,c.eW)(((t,e)=>{(0,n.A)(t,e),t.dir&&e.setDirection(t.dir);for(const r of t.statements)A(r,e)}),"populate"),A=(0,c.eW)(((t,e)=>{const r={Commit:(0,c.eW)((t=>e.commit(I(t))),"Commit"),Branch:(0,c.eW)((t=>e.branch(G(t))),"Branch"),Merge:(0,c.eW)((t=>e.merge(O(t))),"Merge"),Checkout:(0,c.eW)((t=>e.checkout(S(t))),"Checkout"),CherryPicking:(0,c.eW)((t=>e.cherryPick(q(t))),"CherryPicking")}[t.$type];r?r(t):c.cM.error(`Unknown statement type: ${t.$type}`)}),"parseStatement"),I=(0,c.eW)((t=>({id:t.id,msg:t.message??"",type:void 0!==t.type?h[t.type]:h.NORMAL,tags:t.tags??void 0})),"parseCommit"),G=(0,c.eW)((t=>({name:t.name,order:t.order??0})),"parseBranch"),O=(0,c.eW)((t=>({branch:t.branch,id:t.id??"",type:void 0!==t.type?h[t.type]:void 0,tags:t.tags??void 0})),"parseMerge"),S=(0,c.eW)((t=>t.branch),"parseCheckout"),q=(0,c.eW)((t=>({id:t.id,targetId:"",tags:0===t.tags?.length?void 0:t.tags,parent:t.parent})),"parseCherryPicking"),H={parse:(0,c.eW)((async t=>{const e=await(0,s.Qc)("gitGraph",t);c.cM.debug(e),P(e,R)}),"parse")},Y=(0,c.nV)(),z=Y?.gitGraph,D=10,N=40,_=new Map,U=new Map,j=new Map,K=[],F=0,V="LR",J=(0,c.eW)((()=>{_.clear(),U.clear(),j.clear(),F=0,K=[],V="LR"}),"clear"),Q=(0,c.eW)((t=>{const e=document.createElementNS("http://www.w3.org/2000/svg","text");return("string"==typeof t?t.split(/\\n|\n|<br\s*\/?>/gi):t).forEach((t=>{const r=document.createElementNS("http://www.w3.org/2000/svg","tspan");r.setAttributeNS("http://www.w3.org/XML/1998/namespace","xml:space","preserve"),r.setAttribute("dy","1em"),r.setAttribute("x","0"),r.setAttribute("class","row"),r.textContent=t.trim(),e.appendChild(r)})),e}),"drawText"),X=(0,c.eW)((t=>{let e,r,n;return"BT"===V?(r=(0,c.eW)(((t,e)=>t<=e),"comparisonFunc"),n=1/0):(r=(0,c.eW)(((t,e)=>t>=e),"comparisonFunc"),n=0),t.forEach((t=>{const o="TB"===V||"BT"==V?U.get(t)?.y:U.get(t)?.x;void 0!==o&&r(o,n)&&(e=t,n=o)})),e}),"findClosestParent"),Z=(0,c.eW)((t=>{let e="",r=1/0;return t.forEach((t=>{const n=U.get(t).y;n<=r&&(e=t,r=n)})),e||void 0}),"findClosestParentBT"),tt=(0,c.eW)(((t,e,r)=>{let n=r,o=r;const a=[];t.forEach((t=>{const r=e.get(t);if(!r)throw new Error(`Commit not found for key ${t}`);r.parents.length?(n=rt(r),o=Math.max(n,o)):a.push(r),nt(r,n)})),n=o,a.forEach((t=>{ot(t,n,r)})),t.forEach((t=>{const r=e.get(t);if(r?.parents.length){const t=Z(r.parents);n=U.get(t).y-N,n<=o&&(o=n);const e=_.get(r.branch).pos,a=n-D;U.set(r.id,{x:e,y:a})}}))}),"setParallelBTPos"),et=(0,c.eW)((t=>{const e=X(t.parents.filter((t=>null!==t)));if(!e)throw new Error(`Closest parent not found for commit ${t.id}`);const r=U.get(e)?.y;if(void 0===r)throw new Error(`Closest parent position not found for commit ${t.id}`);return r}),"findClosestParentPos"),rt=(0,c.eW)((t=>et(t)+N),"calculateCommitPosition"),nt=(0,c.eW)(((t,e)=>{const r=_.get(t.branch);if(!r)throw new Error(`Branch not found for commit ${t.id}`);const n=r.pos,o=e+D;return U.set(t.id,{x:n,y:o}),{x:n,y:o}}),"setCommitPosition"),ot=(0,c.eW)(((t,e,r)=>{const n=_.get(t.branch);if(!n)throw new Error(`Branch not found for commit ${t.id}`);const o=e+r,a=n.pos;U.set(t.id,{x:a,y:o})}),"setRootPosition"),at=(0,c.eW)(((t,e,r,n,o,a)=>{if(a===h.HIGHLIGHT)t.append("rect").attr("x",r.x-10).attr("y",r.y-10).attr("width",20).attr("height",20).attr("class",`commit ${e.id} commit-highlight${o%8} ${n}-outer`),t.append("rect").attr("x",r.x-6).attr("y",r.y-6).attr("width",12).attr("height",12).attr("class",`commit ${e.id} commit${o%8} ${n}-inner`);else if(a===h.CHERRY_PICK)t.append("circle").attr("cx",r.x).attr("cy",r.y).attr("r",10).attr("class",`commit ${e.id} ${n}`),t.append("circle").attr("cx",r.x-3).attr("cy",r.y+2).attr("r",2.75).attr("fill","#fff").attr("class",`commit ${e.id} ${n}`),t.append("circle").attr("cx",r.x+3).attr("cy",r.y+2).attr("r",2.75).attr("fill","#fff").attr("class",`commit ${e.id} ${n}`),t.append("line").attr("x1",r.x+3).attr("y1",r.y+1).attr("x2",r.x).attr("y2",r.y-5).attr("stroke","#fff").attr("class",`commit ${e.id} ${n}`),t.append("line").attr("x1",r.x-3).attr("y1",r.y+1).attr("x2",r.x).attr("y2",r.y-5).attr("stroke","#fff").attr("class",`commit ${e.id} ${n}`);else{const c=t.append("circle");if(c.attr("cx",r.x),c.attr("cy",r.y),c.attr("r",e.type===h.MERGE?9:10),c.attr("class",`commit ${e.id} commit${o%8}`),a===h.MERGE){const a=t.append("circle");a.attr("cx",r.x),a.attr("cy",r.y),a.attr("r",6),a.attr("class",`commit ${n} ${e.id} commit${o%8}`)}a===h.REVERSE&&t.append("path").attr("d",`M ${r.x-5},${r.y-5}L${r.x+5},${r.y+5}M${r.x-5},${r.y+5}L${r.x+5},${r.y-5}`).attr("class",`commit ${n} ${e.id} commit${o%8}`)}}),"drawCommitBullet"),ct=(0,c.eW)(((t,e,r,n)=>{if(e.type!==h.CHERRY_PICK&&(e.customId&&e.type===h.MERGE||e.type!==h.MERGE)&&z?.showCommitLabel){const o=t.append("g"),a=o.insert("rect").attr("class","commit-label-bkg"),c=o.append("text").attr("x",n).attr("y",r.y+25).attr("class","commit-label").text(e.id),s=c.node()?.getBBox();if(s&&(a.attr("x",r.posWithOffset-s.width/2-2).attr("y",r.y+13.5).attr("width",s.width+4).attr("height",s.height+4),"TB"===V||"BT"===V?(a.attr("x",r.x-(s.width+16+5)).attr("y",r.y-12),c.attr("x",r.x-(s.width+16)).attr("y",r.y+s.height-12)):c.attr("x",r.posWithOffset-s.width/2),z.rotateCommitLabel))if("TB"===V||"BT"===V)c.attr("transform","rotate(-45, "+r.x+", "+r.y+")"),a.attr("transform","rotate(-45, "+r.x+", "+r.y+")");else{const t=-7.5-(s.width+10)/25*9.5,e=10+s.width/25*8.5;o.attr("transform","translate("+t+", "+e+") rotate(-45, "+n+", "+r.y+")")}}}),"drawCommitLabel"),st=(0,c.eW)(((t,e,r,n)=>{if(e.tags.length>0){let o=0,a=0,c=0;const s=[];for(const n of e.tags.reverse()){const e=t.insert("polygon"),i=t.append("circle"),h=t.append("text").attr("y",r.y-16-o).attr("class","tag-label").text(n),d=h.node()?.getBBox();if(!d)throw new Error("Tag bbox not found");a=Math.max(a,d.width),c=Math.max(c,d.height),h.attr("x",r.posWithOffset-d.width/2),s.push({tag:h,hole:i,rect:e,yOffset:o}),o+=20}for(const{tag:t,hole:e,rect:o,yOffset:i}of s){const s=c/2,h=r.y-19.2-i;if(o.attr("class","tag-label-bkg").attr("points",`\n      ${n-a/2-2},${h+2}  \n      ${n-a/2-2},${h-2}\n      ${r.posWithOffset-a/2-4},${h-s-2}\n      ${r.posWithOffset+a/2+4},${h-s-2}\n      ${r.posWithOffset+a/2+4},${h+s+2}\n      ${r.posWithOffset-a/2-4},${h+s+2}`),e.attr("cy",h).attr("cx",n-a/2+2).attr("r",1.5).attr("class","tag-hole"),"TB"===V||"BT"===V){const c=n+i;o.attr("class","tag-label-bkg").attr("points",`\n        ${r.x},${c+2}\n        ${r.x},${c-2}\n        ${r.x+D},${c-s-2}\n        ${r.x+D+a+4},${c-s-2}\n        ${r.x+D+a+4},${c+s+2}\n        ${r.x+D},${c+s+2}`).attr("transform","translate(12,12) rotate(45, "+r.x+","+n+")"),e.attr("cx",r.x+2).attr("cy",c).attr("transform","translate(12,12) rotate(45, "+r.x+","+n+")"),t.attr("x",r.x+5).attr("y",c+3).attr("transform","translate(14,14) rotate(45, "+r.x+","+n+")")}}}}),"drawCommitTags"),it=(0,c.eW)((t=>{switch(t.customType??t.type){case h.NORMAL:return"commit-normal";case h.REVERSE:return"commit-reverse";case h.HIGHLIGHT:return"commit-highlight";case h.MERGE:return"commit-merge";case h.CHERRY_PICK:return"commit-cherry-pick";default:return"commit-normal"}}),"getCommitClassType"),ht=(0,c.eW)(((t,e,r,n)=>{const o={x:0,y:0};if(!(t.parents.length>0))return"TB"===e?30:"BT"===e?(n.get(t.id)??o).y-N:0;{const r=X(t.parents);if(r){const a=n.get(r)??o;return"TB"===e?a.y+N:"BT"===e?(n.get(t.id)??o).y-N:a.x+N}}return 0}),"calculatePosition"),dt=(0,c.eW)(((t,e,r)=>{const n="BT"===V&&r?e:e+D,o="TB"===V||"BT"===V?n:_.get(t.branch)?.pos,a="TB"===V||"BT"===V?_.get(t.branch)?.pos:n;if(void 0===a||void 0===o)throw new Error(`Position were undefined for commit ${t.id}`);return{x:a,y:o,posWithOffset:n}}),"getCommitPosition"),$t=(0,c.eW)(((t,e,r)=>{if(!z)throw new Error("GitGraph config not found");const n=t.append("g").attr("class","commit-bullets"),o=t.append("g").attr("class","commit-labels");let a="TB"===V||"BT"===V?30:0;const s=[...e.keys()],i=z?.parallelCommits??!1,h=(0,c.eW)(((t,r)=>{const n=e.get(t)?.seq,o=e.get(r)?.seq;return void 0!==n&&void 0!==o?n-o:0}),"sortKeys");let d=s.sort(h);"BT"===V&&(i&&tt(d,e,a),d=d.reverse()),d.forEach((t=>{const c=e.get(t);if(!c)throw new Error(`Commit not found for key ${t}`);i&&(a=ht(c,V,a,U));const s=dt(c,a,i);if(r){const t=it(c),e=c.customType??c.type,r=_.get(c.branch)?.index??0;at(n,c,s,t,r,e),ct(o,c,s,a),st(o,c,s,a)}"TB"===V||"BT"===V?U.set(c.id,{x:s.x,y:s.posWithOffset}):U.set(c.id,{x:s.posWithOffset,y:s.y}),a="BT"===V&&i?a+N:a+N+D,a>F&&(F=a)}))}),"drawCommits"),mt=(0,c.eW)(((t,e,r,n,o)=>{const a=("TB"===V||"BT"===V?r.x<n.x:r.y<n.y)?e.branch:t.branch,s=(0,c.eW)((t=>t.branch===a),"isOnBranchToGetCurve"),i=(0,c.eW)((r=>r.seq>t.seq&&r.seq<e.seq),"isBetweenCommits");return[...o.values()].some((t=>i(t)&&s(t)))}),"shouldRerouteArrow"),lt=(0,c.eW)(((t,e,r=0)=>{const n=t+Math.abs(t-e)/2;if(r>5)return n;if(K.every((t=>Math.abs(t-n)>=10)))return K.push(n),n;const o=Math.abs(t-e);return lt(t,e-o/5,r+1)}),"findLane"),gt=(0,c.eW)(((t,e,r,n)=>{const o=U.get(e.id),a=U.get(r.id);if(void 0===o||void 0===a)throw new Error(`Commit positions not found for commits ${e.id} and ${r.id}`);const c=mt(e,r,o,a,n);let s,i="",d="",$=0,m=0,l=_.get(r.branch)?.index;if(r.type===h.MERGE&&e.id!==r.parents[0]&&(l=_.get(e.branch)?.index),c){i="A 10 10, 0, 0, 0,",d="A 10 10, 0, 0, 1,",$=10,m=10;const t=o.y<a.y?lt(o.y,a.y):lt(a.y,o.y),r=o.x<a.x?lt(o.x,a.x):lt(a.x,o.x);"TB"===V?o.x<a.x?s=`M ${o.x} ${o.y} L ${r-$} ${o.y} ${d} ${r} ${o.y+m} L ${r} ${a.y-$} ${i} ${r+m} ${a.y} L ${a.x} ${a.y}`:(l=_.get(e.branch)?.index,s=`M ${o.x} ${o.y} L ${r+$} ${o.y} ${i} ${r} ${o.y+m} L ${r} ${a.y-$} ${d} ${r-m} ${a.y} L ${a.x} ${a.y}`):"BT"===V?o.x<a.x?s=`M ${o.x} ${o.y} L ${r-$} ${o.y} ${i} ${r} ${o.y-m} L ${r} ${a.y+$} ${d} ${r+m} ${a.y} L ${a.x} ${a.y}`:(l=_.get(e.branch)?.index,s=`M ${o.x} ${o.y} L ${r+$} ${o.y} ${d} ${r} ${o.y-m} L ${r} ${a.y+$} ${i} ${r-m} ${a.y} L ${a.x} ${a.y}`):o.y<a.y?s=`M ${o.x} ${o.y} L ${o.x} ${t-$} ${i} ${o.x+m} ${t} L ${a.x-$} ${t} ${d} ${a.x} ${t+m} L ${a.x} ${a.y}`:(l=_.get(e.branch)?.index,s=`M ${o.x} ${o.y} L ${o.x} ${t+$} ${d} ${o.x+m} ${t} L ${a.x-$} ${t} ${i} ${a.x} ${t-m} L ${a.x} ${a.y}`)}else i="A 20 20, 0, 0, 0,",d="A 20 20, 0, 0, 1,",$=20,m=20,"TB"===V?(o.x<a.x&&(s=r.type===h.MERGE&&e.id!==r.parents[0]?`M ${o.x} ${o.y} L ${o.x} ${a.y-$} ${i} ${o.x+m} ${a.y} L ${a.x} ${a.y}`:`M ${o.x} ${o.y} L ${a.x-$} ${o.y} ${d} ${a.x} ${o.y+m} L ${a.x} ${a.y}`),o.x>a.x&&(i="A 20 20, 0, 0, 0,",d="A 20 20, 0, 0, 1,",$=20,m=20,s=r.type===h.MERGE&&e.id!==r.parents[0]?`M ${o.x} ${o.y} L ${o.x} ${a.y-$} ${d} ${o.x-m} ${a.y} L ${a.x} ${a.y}`:`M ${o.x} ${o.y} L ${a.x+$} ${o.y} ${i} ${a.x} ${o.y+m} L ${a.x} ${a.y}`),o.x===a.x&&(s=`M ${o.x} ${o.y} L ${a.x} ${a.y}`)):"BT"===V?(o.x<a.x&&(s=r.type===h.MERGE&&e.id!==r.parents[0]?`M ${o.x} ${o.y} L ${o.x} ${a.y+$} ${d} ${o.x+m} ${a.y} L ${a.x} ${a.y}`:`M ${o.x} ${o.y} L ${a.x-$} ${o.y} ${i} ${a.x} ${o.y-m} L ${a.x} ${a.y}`),o.x>a.x&&(i="A 20 20, 0, 0, 0,",d="A 20 20, 0, 0, 1,",$=20,m=20,s=r.type===h.MERGE&&e.id!==r.parents[0]?`M ${o.x} ${o.y} L ${o.x} ${a.y+$} ${i} ${o.x-m} ${a.y} L ${a.x} ${a.y}`:`M ${o.x} ${o.y} L ${a.x-$} ${o.y} ${i} ${a.x} ${o.y-m} L ${a.x} ${a.y}`),o.x===a.x&&(s=`M ${o.x} ${o.y} L ${a.x} ${a.y}`)):(o.y<a.y&&(s=r.type===h.MERGE&&e.id!==r.parents[0]?`M ${o.x} ${o.y} L ${a.x-$} ${o.y} ${d} ${a.x} ${o.y+m} L ${a.x} ${a.y}`:`M ${o.x} ${o.y} L ${o.x} ${a.y-$} ${i} ${o.x+m} ${a.y} L ${a.x} ${a.y}`),o.y>a.y&&(s=r.type===h.MERGE&&e.id!==r.parents[0]?`M ${o.x} ${o.y} L ${a.x-$} ${o.y} ${i} ${a.x} ${o.y-m} L ${a.x} ${a.y}`:`M ${o.x} ${o.y} L ${o.x} ${a.y+$} ${d} ${o.x+m} ${a.y} L ${a.x} ${a.y}`),o.y===a.y&&(s=`M ${o.x} ${o.y} L ${a.x} ${a.y}`));if(void 0===s)throw new Error("Line definition not found");t.append("path").attr("d",s).attr("class","arrow arrow"+l%8)}),"drawArrow"),yt=(0,c.eW)(((t,e)=>{const r=t.append("g").attr("class","commit-arrows");[...e.keys()].forEach((t=>{const n=e.get(t);n.parents&&n.parents.length>0&&n.parents.forEach((t=>{gt(r,e.get(t),n,e)}))}))}),"drawArrows"),pt=(0,c.eW)(((t,e)=>{const r=t.append("g");e.forEach(((t,e)=>{const n=e%8,o=_.get(t.name)?.pos;if(void 0===o)throw new Error(`Position not found for branch ${t.name}`);const a=r.append("line");a.attr("x1",0),a.attr("y1",o),a.attr("x2",F),a.attr("y2",o),a.attr("class","branch branch"+n),"TB"===V?(a.attr("y1",30),a.attr("x1",o),a.attr("y2",F),a.attr("x2",o)):"BT"===V&&(a.attr("y1",F),a.attr("x1",o),a.attr("y2",30),a.attr("x2",o)),K.push(o);const c=t.name,s=Q(c),i=r.insert("rect"),h=r.insert("g").attr("class","branchLabel").insert("g").attr("class","label branch-label"+n);h.node().appendChild(s);const d=s.getBBox();i.attr("class","branchLabelBkg label"+n).attr("rx",4).attr("ry",4).attr("x",-d.width-4-(!0===z?.rotateCommitLabel?30:0)).attr("y",-d.height/2+8).attr("width",d.width+18).attr("height",d.height+4),h.attr("transform","translate("+(-d.width-14-(!0===z?.rotateCommitLabel?30:0))+", "+(o-d.height/2-1)+")"),"TB"===V?(i.attr("x",o-d.width/2-10).attr("y",0),h.attr("transform","translate("+(o-d.width/2-5)+", 0)")):"BT"===V?(i.attr("x",o-d.width/2-10).attr("y",F),h.attr("transform","translate("+(o-d.width/2-5)+", "+F+")")):i.attr("transform","translate(-19, "+(o-d.height/2)+")")}))}),"drawBranches"),xt=(0,c.eW)((function(t,e,r,n,o){return _.set(t,{pos:e,index:r}),e+(50+(o?40:0)+("TB"===V||"BT"===V?n.width/2:0))}),"setBranchPosition"),ft={parser:H,db:R,renderer:{draw:(0,c.eW)((function(t,e,r,n){if(J(),c.cM.debug("in gitgraph renderer",t+"\n","id:",e,r),!z)throw new Error("GitGraph config not found");const o=z.rotateCommitLabel??!1,s=n.db;j=s.getCommits();const h=s.getBranchesAsObjArray();V=s.getDirection();const d=(0,i.Ys)(`[id="${e}"]`);let $=0;h.forEach(((t,e)=>{const r=Q(t.name),n=d.append("g"),a=n.insert("g").attr("class","branchLabel"),c=a.insert("g").attr("class","label branch-label");c.node()?.appendChild(r);const s=r.getBBox();$=xt(t.name,$,e,s,o),c.remove(),a.remove(),n.remove()})),$t(d,j,!1),z.showBranches&&pt(d,h),yt(d,j),$t(d,j,!0),a.w8.insertTitle(d,"gitTitleText",z.titleTopMargin??0,s.getDiagramTitle()),(0,c.Rw)(void 0,d,z.diagramPadding,z.useMaxWidth)}),"draw")},styles:(0,c.eW)((t=>`\n  .commit-id,\n  .commit-msg,\n  .branch-label {\n    fill: lightgrey;\n    color: lightgrey;\n    font-family: 'trebuchet ms', verdana, arial, sans-serif;\n    font-family: var(--mermaid-font-family);\n  }\n  ${[0,1,2,3,4,5,6,7].map((e=>`\n        .branch-label${e} { fill: ${t["gitBranchLabel"+e]}; }\n        .commit${e} { stroke: ${t["git"+e]}; fill: ${t["git"+e]}; }\n        .commit-highlight${e} { stroke: ${t["gitInv"+e]}; fill: ${t["gitInv"+e]}; }\n        .label${e}  { fill: ${t["git"+e]}; }\n        .arrow${e} { stroke: ${t["git"+e]}; }\n        `)).join("\n")}\n\n  .branch {\n    stroke-width: 1;\n    stroke: ${t.lineColor};\n    stroke-dasharray: 2;\n  }\n  .commit-label { font-size: ${t.commitLabelFontSize}; fill: ${t.commitLabelColor};}\n  .commit-label-bkg { font-size: ${t.commitLabelFontSize}; fill: ${t.commitLabelBackground}; opacity: 0.5; }\n  .tag-label { font-size: ${t.tagLabelFontSize}; fill: ${t.tagLabelColor};}\n  .tag-label-bkg { fill: ${t.tagLabelBackground}; stroke: ${t.tagLabelBorder}; }\n  .tag-hole { fill: ${t.textColor}; }\n\n  .commit-merge {\n    stroke: ${t.primaryColor};\n    fill: ${t.primaryColor};\n  }\n  .commit-reverse {\n    stroke: ${t.primaryColor};\n    fill: ${t.primaryColor};\n    stroke-width: 3;\n  }\n  .commit-highlight-outer {\n  }\n  .commit-highlight-inner {\n    stroke: ${t.primaryColor};\n    fill: ${t.primaryColor};\n  }\n\n  .arrow { stroke-width: 8; stroke-linecap: round; fill: none}\n  .gitTitleText {\n    text-anchor: middle;\n    font-size: 18px;\n    fill: ${t.textColor};\n  }\n`),"getStyles")}}}]);
//# sourceMappingURL=5748.f0dd7b8.js.map