import react from 'react';

interface Atom<T> {
    readonly key: string;
    readonly default?: T;
}
type GlobalAtom<T> = [
    string,
    T,
    () => T,
    (v: T) => void,
    (handle: react.Dispatch<T>) => void
];
type SetStateAction<S> = S | ((prevState: S) => S | undefined) | undefined;
declare const atom: <T>(opt: Atom<T>) => GlobalAtom<T>;
declare const getter: <T>(atom: GlobalAtom<T>) => T;
declare const setter: <T>(atom: GlobalAtom<T>, v: SetStateAction<T>) => void;
declare const useGlobalValue: <T>(atom: GlobalAtom<T>) => T;
declare const useGlobalState: <T>(atom: GlobalAtom<T>) => [T, react.Dispatch<SetStateAction<T>>];

export { atom, getter, setter, useGlobalState, useGlobalValue };
