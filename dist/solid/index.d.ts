import * as solid_js_store from 'solid-js/store';
import { Signal } from 'solid-js';

interface Atom<T> {
    readonly key: string;
    readonly default?: T;
}
interface GlobalAtom<T> {
    readonly k: string;
    readonly d: T;
    readonly g: () => T;
    readonly s: (v: T) => void;
    readonly sb: (handle: (v: T) => void) => void;
    readonly usb: (handle: (v: T) => void) => void;
}
type SetStateAction<S> = S | ((prevState: S) => S | undefined) | undefined;
declare const atom: <T>(opt: Atom<T>) => GlobalAtom<T>;
declare const getter: <T>(atom: GlobalAtom<T>) => T;
declare const setter: <T>(atom: GlobalAtom<T>, v: SetStateAction<T>) => void;
declare const globalSignal: <T>(atom: GlobalAtom<T>) => Signal<T>;
declare const globalStore: <T extends object>(atom: GlobalAtom<T>) => [get: T, set: solid_js_store.SetStoreFunction<T>];

export { atom, getter, globalSignal, globalStore, setter };
