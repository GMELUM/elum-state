import { Dispatch } from "react";
declare type Atom<T> = {
    key: string;
    default: T;
};
declare type GlobalAtom<T> = {
    key: string;
    default: T;
    get: () => T;
    set: (v: any) => void;
    sub: (handle: Dispatch<T>) => void;
};
export declare const atom: <T>(opt: Atom<T>) => GlobalAtom<T>, useGlobalValue: <T>(st: GlobalAtom<T>) => T, useSetGlobalState: <T>(st: GlobalAtom<T>) => (v: T) => void, useGlobalState: <T>(st: GlobalAtom<T>) => [T, (v: T) => void], useFreeGlobalState: <T>(st: GlobalAtom<T>) => [{
    current: T;
}, (v: T) => void], useGlobalUnSubscribe: <T>(st: GlobalAtom<T>) => {
    current: T;
};
export {};
