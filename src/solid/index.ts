import { Signal, createSignal, onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";

type EventType = string | symbol;
type EventHandler<T> = (event: T) => void;
type EventhList<T> = Array<EventHandler<T>>;
type EventhMap<Events extends Record<EventType, unknown>> = Map<keyof Events, EventhList<Events[keyof Events]>>;

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

const events = <Events extends Record<EventType, unknown>>(
  map: EventhMap<Events> = new Map()
) => ({
  on: <Key extends keyof Events>(
    key: Key,
    dispatch: EventHandler<Events[keyof Events]>,
    dispatchList: EventhList<Events[keyof Events]> | undefined = map.get(key)) =>
    dispatchList ? dispatchList.push(dispatch) : map.set(key, [dispatch]),
  off: <Key extends keyof Events>(
    key: Key,
    dispatch: EventHandler<Events[keyof Events]>,
    dispatchList: EventhList<Events[keyof Events]> | undefined = map.get(key)) =>
    dispatchList && dispatch ? dispatchList.splice(dispatchList.indexOf(dispatch) >>> 0, 1) : map.set(key, []),
  emit: <Key extends keyof Events>(
    key: Key,
    value: Events[Key],
    dispatchList: EventhList<Events[keyof Events]> = map.get(key) || []) => {
    for (const dispatch of dispatchList) { dispatch(value) }
  }
}),
  context = {
    m: new Map<string, any>(),
    e: events<Record<string, any>>()
  },
  atom = <T>(opt: Atom<T>): GlobalAtom<T> => {
    return {
      k: opt.key,
      d: opt.default as T,
      g: () => context.m.get(opt.key) ?? opt.default,
      s: (value) => { context.m.set(opt.key, value); context.e.emit(opt.key, value); },
      sb: (value) => { context.e.on(opt.key, value) },
      usb: (value) => { context.e.off(opt.key, value) }
    }
  },
  getter = <T>(atom: GlobalAtom<T>): T => atom.g(),
  setter = <T>(atom: GlobalAtom<T>, v: SetStateAction<T>) => atom.s(typeof v === "function" ? (v as Function)(getter(atom)) : v),
  globalSignal = <T>(atom: GlobalAtom<T>): Signal<T> => {
    const signal = createSignal(getter(atom));
    onMount(() => { atom.sb(signal[1]) })
    onCleanup(() => { atom.usb(signal[1]) })
    return signal;
  },
  globalStore = <T extends object>(atom: GlobalAtom<T>) => {
    const store = createStore(getter(atom));
    onMount(() => { atom.sb(store[1]) });
    onCleanup(() => { atom.usb(store[1]) });
    return store
  };

export {
  atom,
  getter,
  setter,
  globalSignal,
  globalStore
}
