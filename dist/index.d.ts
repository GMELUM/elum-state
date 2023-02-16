import { Dispatch } from 'react';

type Atom<T> = {
    key: string;
    default?: T;
};
type GlobalAtom<T> = {
    key: string;
    default: T;
    get: () => T;
    set: (v: any) => void;
    sub: (handle: Dispatch<T>) => void;
};
type SetStateAction<S> = S | ((prevState: S) => S);
declare const atom: <T>(opt: Atom<T>) => GlobalAtom<T>;
declare const getter: <T>(b: GlobalAtom<T>) => T;
declare const setter: <T>(n: GlobalAtom<T>, v: SetStateAction<T>) => void;
declare const useGlobalValue: <T>(l: GlobalAtom<T>) => T;
declare const useSetGlobalState: <T>(l: GlobalAtom<T>) => Dispatch<SetStateAction<T>>;
declare const useGlobalState: <T>(l: GlobalAtom<T>) => [T, Dispatch<SetStateAction<T>>];
declare const useUnSubGlobalState: <T>(l: GlobalAtom<T>) => [{
    current: T;
}, Dispatch<SetStateAction<T>>];
declare const useUnSubGlobalValue: <T>(l: GlobalAtom<T>) => {
    current: T;
};

export { atom, getter, setter, useGlobalState, useGlobalValue, useSetGlobalState, useUnSubGlobalState, useUnSubGlobalValue };
