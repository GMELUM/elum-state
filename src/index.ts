import { Dispatch, useLayoutEffect as useLE, useRef, useState } from "react";

type EventType = string | symbol;
type h<T = unknown> = (event: T) => void;
type EventhList<T = unknown> = Array<h<T>>;
type EventhMap<Events extends Record<EventType, unknown>> = Map<keyof Events, EventhList<Events[keyof Events]>>;

type Atom<T> = {
  key: string;
  default: T;
};

type GlobalAtom<T> = {
  k: string;
  d: T;
  g: () => T;
  s: (v: any) => void;
  sb: (handle: Dispatch<T>) => void;
}

const em = <Events extends Record<EventType, unknown>>(
  a: EventhMap<Events> = new Map()
) => ({
  a,
  on: <Key extends keyof Events>(
    t: Key,
    h: h<Events[keyof Events]>,
    hs: EventhList<Events[keyof Events]> | undefined = a.get(t)) =>
    hs ? hs.push(h) : a.set(t, [h] as EventhList<Events[keyof Events]>)
  ,
  off: <Key extends keyof Events>(
    t: Key,
    h: h<Events[keyof Events]>,
    hs: EventhList<Events[keyof Events]> | undefined = a.get(t)) =>
    hs && h ? hs.splice(hs.indexOf(h) >>> 0, 1) : a.set(t, [])
  ,
  emit: <Key extends keyof Events>(
    t: Key,
    e?: Events[Key],
    hs: EventhList<Events[keyof Events]> | undefined = a.get(t)) =>
    hs && e && hs.slice().map((h) => h(e))
}),
  c = {
    s: new Map<string, any>(),
    em: em<Record<string, any>>()
  },
  st = <T>(o: Atom<T>): GlobalAtom<T> => ({
    k: o.key,
    d: o.default,
    g: () => c.s.get(o.key) || o.default,
    s: (v) => c.s.set(o.key, v),
    sb: (h) => {
      c.em.on(o.key, h);
      return () => c.em.off(o.key, h);
    }
  });

export const
  atom = <T>(o: Atom<T>) => st(o),
  useGlobalValue = <T>(st: GlobalAtom<T>): T => {
    const [v, d] = useState(st.g());
    useLE(() => st.s(d), []);
    return v;
  },
  useSetGlobalState = <T>(st: GlobalAtom<T>): (v: T) => void => (v: T) => c.em.emit(st.k, v),
  useGlobalState = <T>(st: GlobalAtom<T>): [T, (v: T) => void] => [useGlobalValue(st), useSetGlobalState(st)],
  useUnSubGlobalState = <T>(st: GlobalAtom<T>): [{ current: T }, (v: T) => void] => [useUnSubGlobalValue(st), useSetGlobalState(st)],
  useUnSubGlobalValue = <T>(st: GlobalAtom<T>): { current: T } => {
    const v = useRef<T>(c.s.get(st.k) || st.d);
    useLE(() => st.sb((vl: T) => { v.current = vl }), []);
    return v;
  };
