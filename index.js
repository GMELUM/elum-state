import { useLayoutEffect, useRef, useState } from "react";
const emmiter = (all = new Map()) => ({
    all,
    on: (type, handler, handlers = all.get(type)) => handlers ? handlers.push(handler) : all.set(type, [handler]),
    off: (type, handler, handlers = all.get(type)) => handlers && handler ? handlers.splice(handlers.indexOf(handler) >>> 0, 1) : all.set(type, []),
    emit: (type, evt, handlers = all.get(type)) => handlers && evt && handlers.slice().map((handler) => handler(evt))
}), context = {
    store: new Map(),
    emmit: emmiter()
}, stateAtom = (opt) => ({
    key: opt.key,
    default: opt.default,
    get: () => context.store.get(opt.key) || opt.default,
    set: (value) => context.store.set(opt.key, value),
    sub: (handler) => {
        context.emmit.on(opt.key, handler);
        return () => context.emmit.off(opt.key, handler);
    }
});
export const atom = (opt) => stateAtom(opt), useGlobalValue = (state) => {
    const [value, dispatch] = useState(state.get());
    useLayoutEffect(() => state.sub(dispatch), []);
    return value;
}, useSetGlobalState = (state) => (value) => context.emmit.emit(state.key, value), useGlobalState = (state) => [useGlobalValue(state), useSetGlobalState(state)], useFreeGlobalState = (state) => [useGlobalUnSubscribe(state), useSetGlobalState(state)], useGlobalUnSubscribe = (state) => {
    const value = useRef(context.store.get(state.key));
    useLayoutEffect(() => state.sub((v) => { value.current = v; }), []);
    return value;
};
