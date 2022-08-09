import { Dispatch } from "react";
declare type Atom<T> = {
    key: string;
    default: T;
};
declare type GlobalAtom<T> = {
    k: string;
    d: T;
    g: () => T;
    s: (v: any) => void;
    sb: (handle: Dispatch<T>) => void;
};
export declare const atom: <T>(o: Atom<T>) => GlobalAtom<T>, useGlobalValue: <T>(st: GlobalAtom<T>) => T, useSetGlobalState: <T>(st: GlobalAtom<T>) => (v: T) => void, useGlobalState: <T>(st: GlobalAtom<T>) => [T, (v: T) => void], useUnSubGlobalState: <T>(st: GlobalAtom<T>) => [{
    current: T;
}, (v: T) => void], useUnSubGlobalValue: <T>(st: GlobalAtom<T>) => {
    current: T;
};
export {};
