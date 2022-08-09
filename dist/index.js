import { useLayoutEffect, useRef, useState } from "react";
const em = (a = new Map()) => ({
    a,
    on: (t, h, hs = a.get(t)) => hs ? hs.push(h) : a.set(t, [h]),
    off: (t, h, hs = a.get(t)) => hs && h ? hs.splice(hs.indexOf(h) >>> 0, 1) : a.set(t, []),
    emit: (t, e, hs = a.get(t)) => hs && e && hs.slice().map((h) => h(e))
}), c = {
    s: new Map(),
    em: em()
}, st = (o) => ({
    k: o.key,
    d: o.default,
    g: () => c.s.get(o.key) || o.default,
    s: (v) => c.s.set(o.key, v),
    sb: (h) => {
        c.em.on(o.key, h);
        return () => c.em.off(o.key, h);
    }
});
export const atom = (o) => st(o), useGlobalValue = (st) => {
    const [v, d] = useState(st.g());
    useLayoutEffect(() => st.s(d), []);
    return v;
}, useSetGlobalState = (st) => (v) => c.em.emit(st.k, v), useGlobalState = (st) => [useGlobalValue(st), useSetGlobalState(st)], useUnSubGlobalState = (st) => [useUnSubGlobalValue(st), useSetGlobalState(st)], useUnSubGlobalValue = (st) => {
    const v = useRef(c.s.get(st.k) || st.d);
    useLayoutEffect(() => st.sb((vl) => { v.current = vl; }), []);
    return v;
};
