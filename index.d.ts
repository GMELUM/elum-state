import { Dispatch } from "react";
declare type Atom<T> = {
    key: string;
    default: T;
};
declare type GlobalAtom<T> = {
    key: string;
    default: T;
    get: () => T;
    set: (value: any) => void;
    sub: (handle: Dispatch<T>) => void;
};
export declare const atom: <T>(opt: Atom<T>) => GlobalAtom<T>, useGlobalValue: <T>(state: GlobalAtom<T>) => T, useSetGlobalState: <T>(state: GlobalAtom<T>) => (value: T) => void, useGlobalState: <T>(state: GlobalAtom<T>) => [T, (value: T) => void], useFreeGlobalState: <T>(state: GlobalAtom<T>) => [{
    current: T;
}, (value: T) => void], useGlobalUnSubscribe: <T>(state: GlobalAtom<T>) => {
    current: T;
};
export {};
