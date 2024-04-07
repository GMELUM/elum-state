import { Signal, Setter } from 'solid-js';

interface Atom<T> {
    readonly key: string;
    readonly default?: T;
}
type GlobalAtom<T> = [
    string,
    T,
    () => T,
    (v: T) => void,
    (handle: (v: T) => void) => void,
    (handle: Setter<T>) => void
];
type SetStateAction<S> = S | ((prevState: S) => S | undefined) | undefined;
declare const atom: <T>(opt: Atom<T>) => GlobalAtom<T>;
declare const getter: <T>(atom: GlobalAtom<T>) => T;
declare const setter: <T>(atom: GlobalAtom<T>, v: SetStateAction<T>) => void;
declare const globalSignal: <T>(atom: GlobalAtom<T>) => Signal<T>;

export { atom, getter, globalSignal, setter };
