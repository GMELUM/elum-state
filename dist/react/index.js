"use strict";var e=require("react");const t={m:new Map,e:((e=new Map)=>[(t,s,o=e.get(t))=>o?o.push(s):e.set(t,[s]),(t,s,o=e.get(t))=>o&&s?o.splice(o.indexOf(s)>>>0,1):e.set(t,[]),(t,s,o=e.get(t)||[])=>{for(const e of o)e(s)}])()},s=e=>e[2](),o=(e,t)=>e[3]("function"==typeof t?t(s(e)):t),r=t=>{const[o,r]=e.useState(s(t));return e.useLayoutEffect((()=>t[4](r)),[]),o};exports.atom=e=>[e.key,e.default,()=>t.m.get(e.key)??e.default,s=>{t.m.set(e.key,s),t.e[2](e.key,s)},s=>(t.e[0](e.key,s),()=>t.e[1](e.key,s))],exports.getter=s,exports.setter=o,exports.useGlobalState=e=>[r(e),t=>o(e,t)],exports.useGlobalValue=r;