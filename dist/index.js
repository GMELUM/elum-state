import { useLayoutEffect, useRef, useState } from "react";
const em = (a = new Map()) => ({
    a,
    on: (t, h, hs = a.get(t)) => hs ? hs.push(h) : a.set(t, [h]),
    off: (t, h, hs = a.get(t)) => hs && h ? hs.splice(hs.indexOf(h) >>> 0, 1) : a.set(t, []),
    emit: (t, e, hs = a.get(t)) => hs && e && hs.slice().map((h) => h(e))
}), c = {
    s: new Map(),
    em: em()
}, stateAtom = (opt) => ({
    key: opt.key,
    default: opt.default,
    get: () => c.s.get(opt.key) || opt.default,
    set: (v) => c.s.set(opt.key, v),
    sub: (h) => {
        c.em.on(opt.key, h);
        return () => c.em.off(opt.key, h);
    }
});
export const atom = (opt) => stateAtom(opt), useGlobalValue = (st) => {
    const [v, dispatch] = useState(st.get());
    useLayoutEffect(() => st.sub(dispatch), []);
    return v;
}, useSetGlobalState = (st) => (v) => c.em.emit(st.key, v), useGlobalState = (st) => [useGlobalValue(st), useSetGlobalState(st)], useUnSubGlobalState = (st) => [useUnSubGlobalValue(st), useSetGlobalState(st)], useUnSubGlobalValue = (st) => {
    const v = useRef(c.s.get(st.key) || st.default);
    useLayoutEffect(() => st.sub((vl) => { v.current = vl; }), []);
    return v;
};
