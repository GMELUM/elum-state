import e from"react";const t={m:new Map,e:((e=new Map)=>({on:(t,o,s=e.get(t))=>s?s.push(o):e.set(t,[o]),off:(t,o,s=e.get(t))=>s&&o?s.splice(s.indexOf(o)>>>0,1):e.set(t,[]),emit:(t,o,s=e.get(t)||[])=>{for(const e of s)e(o)}}))()},o=e=>{const{key:o}=e;return{k:o,d:e.default,g:()=>t.m.get(o)??e.default,s:e=>{t.m.set(o,e),t.e.emit(o,e)},sb:e=>(t.e.on(o,e),()=>t.e.off(o,e))}},s=e=>e.g(),f=(e,t)=>e.s("function"==typeof t?t(s(e)):t),n=t=>{const[o,f]=e.useState(s(t));return e.useLayoutEffect((()=>t.sb(f)),[]),o},r=e=>[n(e),t=>f(e,t)];export{o as atom,s as getter,f as setter,r as useGlobalState,n as useGlobalValue};