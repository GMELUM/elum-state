import react from 'react';

interface Atom<T> {
    readonly key: string;
    readonly default?: T;
}
interface GlobalAtom<T> {
    readonly k: string;
    readonly d: T;
    readonly g: () => T;
    readonly s: (v: T) => void;
    readonly sb: (handle: react.Dispatch<T>) => void;
}
type SetStateAction<S> = S | ((prevState: S) => S);
declare const atom: <T>(opt: Atom<T>) => GlobalAtom<T>;
declare const getter: <T>(atom: GlobalAtom<T>) => T;
declare const setter: <T>(atom: GlobalAtom<T>, v: SetStateAction<T>) => void;
declare const useGlobalValue: <T>(atom: GlobalAtom<T>) => T;
declare const useGlobalState: <T>(atom: GlobalAtom<T>) => [T, react.Dispatch<SetStateAction<T>>];

export { Atom, GlobalAtom, atom, getter, setter, useGlobalState, useGlobalValue };
