"use strict";(self.webpackChunkjupyterlab_myst=self.webpackChunkjupyterlab_myst||[]).push([[2952,5332],{85332:(e,i,t)=>{t.r(i),t.d(i,{exerciseDirective:()=>o,exerciseDirectives:()=>s,solutionDirective:()=>l});var n=t(58864);const o={name:"exercise",alias:["exercise-start"],arg:{type:"myst"},options:{label:{type:String},class:{type:String},nonumber:{type:Boolean},hidden:{type:Boolean}},body:{type:"myst"},run(e){var i,t,o,l,s;const r=[];e.arg&&r.push({type:"admonitionTitle",children:e.arg}),e.body&&r.push(...e.body);const a=null!==(t=null===(i=e.options)||void 0===i?void 0:i.nonumber)&&void 0!==t&&t,d=a?void 0:`exercise-${(0,n.createId)()}`,p=(null===(o=e.options)||void 0===o?void 0:o.label)||d,{label:u,identifier:c}=(0,n.normalizeLabel)(p)||{},y={type:"exercise",label:u,identifier:c,class:null===(l=e.options)||void 0===l?void 0:l.class,hidden:null===(s=e.options)||void 0===s?void 0:s.hidden,enumerated:!a,children:r};return e.name.endsWith("-start")&&(y.gate="start"),[y]}},l={name:"solution",alias:["solution-start"],arg:{type:String,required:!0},options:{label:{type:String},class:{type:String},hidden:{type:Boolean}},body:{type:"myst"},run(e){var i,t,o;const l=[];if(e.arg){const{label:i,identifier:t}=(0,n.normalizeLabel)(e.arg)||{};l.push({type:"admonitionTitle",children:[{type:"text",value:"Solution to "},{type:"crossReference",label:i,identifier:t}]})}e.body&&l.push(...e.body);const s=null===(i=e.options)||void 0===i?void 0:i.label,{label:r,identifier:a}=(0,n.normalizeLabel)(s)||{},d={type:"solution",label:r,identifier:a,class:null===(t=e.options)||void 0===t?void 0:t.class,hidden:null===(o=e.options)||void 0===o?void 0:o.hidden,children:l};return e.name.endsWith("-start")&&(d.gate="start"),[d]}},s=[o,{name:"exercise-end",run:()=>[{type:"exercise",gate:"end"}]},l,{name:"solution-end",run:()=>[{type:"solution",gate:"end"}]}]}}]);