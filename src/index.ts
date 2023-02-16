import { Dispatch, useLayoutEffect, useRef, useState } from "react";

type EventType = string | symbol;
type h<T> = (event: T) => void;
type EventhList<T> = Array<h<T>>;
type EventhMap<Events extends Record<EventType, unknown>> = Map<keyof Events, EventhList<Events[keyof Events]>>;

type Atom<T> = {
  key: string;
  default?: T;
};

type GlobalAtom<T> = {
  key: string;
  default: T;
  get: () => T;
  set: (v: any) => void;
  sub: (handle: Dispatch<T>) => void;
}

type TSetter = {
  <T>(a: GlobalAtom<T>, v: T): void;
  <T>(a: GlobalAtom<T>, v: (v: T) => T): void;
}

const em = <Events extends Record<EventType, unknown>>(
  m: EventhMap<Events> = new Map()
) => ({
  on: <Key extends keyof Events>(
    k: Key,
    h: h<Events[keyof Events]>,
    x: EventhList<Events[keyof Events]> | undefined = m.get(k)) =>
    x ? x.push(h) : m.set(k, [h] as EventhList<Events[keyof Events]>)
  ,
  off: <Key extends keyof Events>(
    k: Key,
    h: h<Events[keyof Events]>,
    x: EventhList<Events[keyof Events]> | undefined = m.get(k)) =>
    x && h ? x.splice(x.indexOf(h) >>> 0, 1) : m.set(k, [])
  ,
  emit: <Key extends keyof Events>(
    k: Key,
    z: Events[Key],
    x: EventhList<Events[keyof Events]> | undefined = m.get(k)) =>
    x && x.slice().map((h) => h(z))
}),
  c = {
    s: new Map<string, any>(),
    em: em<Record<string, any>>()
  },
  a = <T>(opt: Atom<T>): GlobalAtom<T> => ({
    key: opt.key,
    default: (opt.default as T),
    get: () => c.s.get(opt.key) ?? opt.default,
    set: (v) => { c.s.set(opt.key, v); c.em.emit(opt.key, v); },
    sub: (h) => {
      c.em.on(opt.key, h);
      return () => c.em.off(opt.key, h);
    }
  }),
  w = <T>(l: GlobalAtom<T>): T => {
    const [v, dispatch] = useState(l.get());
    useLayoutEffect(() => l.sub(dispatch), []);
    return v;
  },
  g = <T>(b: GlobalAtom<T>): T => b.get(),
  s: TSetter = (n, v) => {
    typeof v === "function" ?
      n.set((v as Function)(g(n))) :
      n.set(v);
  },
  q = <T>(l: GlobalAtom<T>): (v: T) => void => (v: T) => l.set(v),
  e = <T>(l: GlobalAtom<T>): [T, (v: T) => void] => [w(l), q(l)],
  r = <T>(l: GlobalAtom<T>): [{ current: T }, (v: T) => void] => [t(l), q(l)],
  t = <T>(l: GlobalAtom<T>): { current: T } => {
    const v = useRef<T>(l.get());
    useLayoutEffect(() => l.sub((vl: T) => { v.current = vl }), []);
    return v;
  };

export const
  atom = a,
  getter = g,
  setter = s,
  useGlobalValue = w,
  useSetGlobalState = q,
  useGlobalState = e,
  useUnSubGlobalState = r,
  useUnSubGlobalValue = t;
