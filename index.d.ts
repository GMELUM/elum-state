import { Dispatch } from 'react';

interface Atom<T> {
    readonly key: string;
    readonly default?: T;
}
interface GlobalAtom<T> extends Required<Atom<T>> {
    readonly get: () => T;
    readonly set: (v: T) => void;
    readonly sub: (handle: Dispatch<T>) => void;
}
type SetStateAction<S> = S | ((prevState: S) => S);
declare const atom: <T>(opt: Atom<T>) => GlobalAtom<T>;
declare const getter: <T>(b: GlobalAtom<T>) => T;
declare const setter: <T>(n: GlobalAtom<T>, v: SetStateAction<T>) => void;
declare const useGlobalValue: <T>(l: GlobalAtom<T>) => T;
declare const useGlobalState: <T>(l: GlobalAtom<T>) => [T, Dispatch<SetStateAction<T>>];

export { Atom, GlobalAtom, atom, getter, setter, useGlobalState, useGlobalValue };
