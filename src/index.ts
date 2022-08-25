import { Dispatch, useLayoutEffect, useRef, useState } from "react";

type EventType = string | symbol;
type h<T = unknown> = (event: T) => void;
type EventhList<T = unknown> = Array<h<T>>;
type EventhMap<Events extends Record<EventType, unknown>> = Map<keyof Events, EventhList<Events[keyof Events]>>;

type Atom<T> = {
  key: string;
  default: T;
};

type GlobalAtom<T> = {
  key: string;
  default: T;
  get: () => T;
  set: (v: any) => void;
  sub: (handle: Dispatch<T>) => void;
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
    e: Events[Key],
    hs: EventhList<Events[keyof Events]> | undefined = a.get(t)) =>
    hs?.slice().map((h) => h(e))
}),
  c = {
    s: new Map<string, any>(),
    em: em<Record<string, any>>()
  },
  a = <T>(opt: Atom<T>): GlobalAtom<T> => ({
    key: opt.key,
    default: opt.default,
    get: () => c.s.get(opt.key) ?? opt.default,
    set: (v) => { c.s.set(opt.key, v); c.em.emit(opt.key, v); },
    sub: (h) => {
      c.em.on(opt.key, h);
      return () => c.em.off(opt.key, h);
    }
  }),
  w = <T>(st: GlobalAtom<T>): T => {
    const [v, dispatch] = useState(st.get());
    useLayoutEffect(() => st.sub(dispatch), []);
    return v;
  },
  q = <T>(st: GlobalAtom<T>): (v: T) => void => (v: T) => st.set(v),
  e = <T>(st: GlobalAtom<T>): [T, (v: T) => void] => [w(st), q(st)],
  r = <T>(st: GlobalAtom<T>): [{ current: T }, (v: T) => void] => [t(st), q(st)],
  t = <T>(st: GlobalAtom<T>): { current: T } => {
    const v = useRef<T>(st.get());
    useLayoutEffect(() => st.sub((vl: T) => { v.current = vl }), []);
    return v;
  };

export const
  atom = a,
  useGlobalValue = w,
  useSetGlobalState = q,
  useGlobalState = e,
  useUnSubGlobalState = r,
  useUnSubGlobalValue = t;
