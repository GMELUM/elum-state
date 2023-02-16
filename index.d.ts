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
type TSetter = {
    <T>(a: GlobalAtom<T>, v: T): void;
    <T>(a: GlobalAtom<T>, v: (v: T) => T): void;
};
declare const atom: <T>(opt: Atom<T>) => GlobalAtom<T>;
declare const getter: <T>(b: GlobalAtom<T>) => T;
declare const setter: TSetter;
declare const useGlobalValue: <T>(l: GlobalAtom<T>) => T;
declare const useSetGlobalState: <T>(l: GlobalAtom<T>) => (v: T) => void;
declare const useGlobalState: <T>(l: GlobalAtom<T>) => [T, (v: T) => void];
declare const useUnSubGlobalState: <T>(l: GlobalAtom<T>) => [{
    current: T;
}, (v: T) => void];
declare const useUnSubGlobalValue: <T>(l: GlobalAtom<T>) => {
    current: T;
};

export { atom, getter, setter, useGlobalState, useGlobalValue, useSetGlobalState, useUnSubGlobalState, useUnSubGlobalValue };
