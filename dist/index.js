import { useLayoutEffect, useRef, useState } from "react";
const em = (a = new Map()) => ({
    a,
    on: (t, h, hs = a.get(t)) => hs ? hs.push(h) : a.set(t, [h]),
    off: (t, h, hs = a.get(t)) => hs && h ? hs.splice(hs.indexOf(h) >>> 0, 1) : a.set(t, []),
    emit: (t, e, hs = a.get(t)) => hs?.slice().map((h) => h(e))
}), c = {
    s: new Map(),
    em: em()
}, a = (opt) => ({
    key: opt.key,
    default: opt.default,
    get: () => c.s.get(opt.key) ?? opt.default,
    set: (v) => { c.s.set(opt.key, v); c.em.emit(opt.key, v); },
    sub: (h) => {
        c.em.on(opt.key, h);
        return () => c.em.off(opt.key, h);
    }
}), w = (st) => {
    const [v, dispatch] = useState(st.get());
    useLayoutEffect(() => st.sub(dispatch), []);
    return v;
}, q = (st) => (v) => st.set(v), e = (st) => [w(st), q(st)], r = (st) => [t(st), q(st)], t = (st) => {
    const v = useRef(st.get());
    useLayoutEffect(() => st.sub((vl) => { v.current = vl; }), []);
    return v;
};
export const atom = a, useGlobalValue = w, useSetGlobalState = q, useGlobalState = e, useUnSubGlobalState = r, useUnSubGlobalValue = t;
