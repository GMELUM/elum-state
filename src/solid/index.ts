import { Setter, Signal, createSignal, onCleanup, onMount } from "solid-js";

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
  (handle: Setter<T>) => void
]

type SetStateAction<S> = S | ((prevState: S) => S | undefined) | undefined;

const context = {
  m: new Map<string, any>(),
  e: (<Events extends Record<EventType, any>>(
    map: EventhMap<Events> = new Map()
  ) => ([
    <Key extends keyof Events>(
      key: Key,
      dispatch: EventHandler<Events[keyof Events]>,
      dispatchList: EventhList<Events[keyof Events]> | undefined = map.get(key)) =>
      dispatchList ? dispatchList.push(dispatch) : map.set(key, [dispatch]),
    <Key extends keyof Events>(
      key: Key,
      dispatch: EventHandler<Events[keyof Events]>,
      dispatchList: EventhList<Events[keyof Events]> | undefined = map.get(key)) =>
      dispatchList && dispatch ? dispatchList.splice(dispatchList.indexOf(dispatch) >>> 0, 1) : map.set(key, []),
    <Key extends keyof Events>(
      key: Key,
      value: Events[Key],
      dispatchList: EventhList<Events[keyof Events]> = map.get(key) || []) => {
      for (const dispatch of dispatchList) { dispatch(value) }
    }
  ]))()
},
  atom = <T>(opt: Atom<T>): GlobalAtom<T> => ([
    opt.key,
    opt.default as T,
    () => context.m.get(opt.key) ?? opt.default,
    (value) => { context.m.set(opt.key, value); context.e[2](opt.key, value); },
    (value) => { context.e[0](opt.key, value) },
    (value) => { context.e[1](opt.key, value) }
  ]),
  getter = <T>(atom: GlobalAtom<T>): T => atom[2](),
  setter = <T>(atom: GlobalAtom<T>, v: SetStateAction<T>) => atom[3](typeof v === "function" ? (v as Function)(getter(atom)) : v),
  globalSignal = <T>(atom: GlobalAtom<T>): Signal<T> => {
    const signal = createSignal(atom[2]())
    onMount(() => atom[4](signal[1]))
    onCleanup(() => atom[5](signal[1]))
    return [signal[0], ((v: SetStateAction<T>) => { setter(atom, v) }) as Setter<T>]
  }

export {
  atom,
  getter,
  setter,
  globalSignal
}
