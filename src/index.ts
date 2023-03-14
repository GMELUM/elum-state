import { Dispatch, useLayoutEffect, useState } from "react";

type EventType = string | symbol;
type EventHandler<T> = (event: T) => void;
type EventhList<T> = Array<EventHandler<T>>;
type EventhMap<Events extends Record<EventType, unknown>> = Map<keyof Events, EventhList<Events[keyof Events]>>;

interface Atom<T> {
  readonly key: string;
  readonly default?: T;
};

interface GlobalAtom<T> extends Required<Atom<T>> {
  readonly get: () => T;
  readonly set: (v: T) => void;
  readonly sub: (handle: Dispatch<T>) => void;
}

type SetStateAction<S> = S | ((prevState: S) => S);

const events = <Events extends Record<EventType, unknown>>(
  map: EventhMap<Events> = new Map()
) => ({
  on: <Key extends keyof Events>(
    key: Key,
    handler: EventHandler<Events[keyof Events]>,
    x: EventhList<Events[keyof Events]> | undefined = map.get(key)) =>
    x ? x.push(handler) : map.set(key, [handler]),
  off: <Key extends keyof Events>(
    key: Key,
    handler: EventHandler<Events[keyof Events]>,
    x: EventhList<Events[keyof Events]> | undefined = map.get(key)) =>
    x && handler ? x.splice(x.indexOf(handler) >>> 0, 1) : map.set(key, []),
  emit: <Key extends keyof Events>(
    k: Key,
    z: Events[Key],
    x: EventhList<Events[keyof Events]> | undefined = map.get(k)) => {
    if (!x) { return; }
    for (const handler of x) { handler(z) }
  }
}),
  context = {
    map: new Map<string, any>(),
    events: events<Record<string, any>>()
  },
  atom = <T>(opt: Atom<T>): GlobalAtom<T> => ({
    key: opt.key,
    default: opt.default as T,
    get: () => context.map.get(opt.key) ?? opt.default,
    set: (value) => { context.map.set(opt.key, value); context.events.emit(opt.key, value); },
    sub: (value) => {
      context.events.on(opt.key, value);
      return () => context.events.off(opt.key, value);
    }
  }),
  getter = <T>(b: GlobalAtom<T>): T => b.get(),
  setter = <T>(n: GlobalAtom<T>, v: SetStateAction<T>) =>
    n.set(typeof v === "function" ? (v as Function)(getter(n)) : v),
  useGlobalValue = <T>(l: GlobalAtom<T>): T => {
    const [v, dispatch] = useState(getter(l));
    useLayoutEffect(() => l.sub(dispatch), []);
    return v;
  },
  useGlobalState = <T>(l: GlobalAtom<T>): [T, Dispatch<SetStateAction<T>>] => [useGlobalValue(l), (v: SetStateAction<T>) => setter(l, v)]

export {
  atom,
  getter,
  setter,
  useGlobalValue,
  useGlobalState,
  GlobalAtom,
  Atom
}
