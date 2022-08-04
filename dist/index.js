"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGlobalUnSubscribe = exports.useFreeGlobalState = exports.useSetGlobalState = exports.useGlobalValue = exports.useGlobalState = exports.emmiter = exports.atom = exports.RootState = void 0;
const react_1 = require("react");
const emmiter = (all = new Map()) => ({
    all,
    on: (type, handler) => {
        const handlers = all.get(type);
        handlers ? handlers.push(handler) : all.set(type, [handler]);
    },
    off: (type, handler) => {
        const handlers = all.get(type);
        handlers && handler ?
            handlers.splice(handlers.indexOf(handler) >>> 0, 1) :
            all.set(type, []);
    },
    emit: (type, evt) => {
        let handlers = all.get(type);
        handlers && evt && handlers
            .slice().map((handler) => handler(evt));
    }
});
exports.emmiter = emmiter;
const context = {
    store: new Map(),
    emmit: emmiter()
};
const GlobalStateContext = (0, react_1.createContext)(context);
const atom = (opt) => opt;
exports.atom = atom;
const useFreeGlobalState = (atom) => [useGlobalUnSubscribe(atom), useSetGlobalState(atom)];
exports.useFreeGlobalState = useFreeGlobalState;
const useGlobalState = (atom) => [useGlobalValue(atom), useSetGlobalState(atom)];
exports.useGlobalState = useGlobalState;
const useGlobalUnSubscribe = (atom) => {
    const context = (0, react_1.useContext)(GlobalStateContext);
    if (!context) {
        throw new Error('This component must be used inside a <RootState> component.');
    }
    if (!context.store.has(atom.key)) {
        context.store.set(atom.key, atom.default);
    }
    const value = (0, react_1.useRef)(context.store.get(atom.key));
    const handlerDispatch = (v) => {
        value.current = v;
    };
    (0, react_1.useLayoutEffect)(() => {
        context.emmit.on(atom.key, handlerDispatch);
        return () => context.emmit.off(atom.key, handlerDispatch);
    }, []);
    return value;
};
exports.useGlobalUnSubscribe = useGlobalUnSubscribe;
const useGlobalValue = (atom) => {
    const context = (0, react_1.useContext)(GlobalStateContext);
    if (!context) {
        throw new Error('This component must be used inside a <RootState> component.');
    }
    if (!context.store.has(atom.key)) {
        context.store.set(atom.key, atom.default);
    }
    const value = context.store.get(atom.key);
    const [state, dispatch] = (0, react_1.useState)(value);
    (0, react_1.useLayoutEffect)(() => {
        context.emmit.on(atom.key, dispatch);
        return () => context.emmit.off(atom.key, dispatch);
    }, []);
    return state;
};
exports.useGlobalValue = useGlobalValue;
const useSetGlobalState = (atom) => {
    const context = (0, react_1.useContext)(GlobalStateContext);
    if (!context) {
        throw new Error('This component must be used inside a <RootState> component.');
    }
    if (!context.store.has(atom.key)) {
        context.store.set(atom.key, atom.default);
    }
    return (value) => context.emmit.emit(atom.key, value);
};
exports.useSetGlobalState = useSetGlobalState;
const RootState = ({ children }) => ((0, react_1.createElement)(GlobalStateContext.Provider, { value: context }, children));
exports.RootState = RootState;
