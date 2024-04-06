import { Setter, Signal, createEffect, createSignal, mergeProps, onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";

type EventType = string | symbol;
type EventHandler<T> = (event: T) => void;
type EventhList<T> = Array<EventHandler<T>>;
type EventhMap<Events extends Record<EventType, unknown>> = Map<keyof Events, EventhList<Events[keyof Events]>>;

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
  (handle: (v: T) => void) => void
]

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
  atom = <T>(opt: Atom<T>): GlobalAtom<T> => ([
    opt.key,
    opt.default as T,
    () => context.m.get(opt.key) ?? opt.default,
    (value) => { context.m.set(opt.key, value); context.e.emit(opt.key, value); },
    (value) => { context.e.on(opt.key, value) },
    (value) => { context.e.off(opt.key, value) }
  ]),
  getter = <T>(atom: GlobalAtom<T>): T => atom[2](),
  setter = <T>(atom: GlobalAtom<T>, v: SetStateAction<T>) => atom[3](typeof v === "function" ? (v as Function)(getter(atom)) : v),
  globalSignal = <T>(atom: GlobalAtom<T>): Signal<T> => {
    const signal = createSignal(getter(atom));
    createEffect(() => { atom[3](signal[0]()) })
    onMount(() => atom[4](signal[1]))
    onCleanup(() => atom[5](signal[1]))
    return signal
  }

export {
  atom,
  getter,
  setter,
  globalSignal,
  GlobalAtom,
  Atom
}
