import { Dispatch, useLayoutEffect, useRef, useState } from "react";

type EventType = string | symbol;
type Handler<T = unknown> = (event: T) => void;
type EventHandlerList<T = unknown> = Array<Handler<T>>;
type EventHandlerMap<Events extends Record<EventType, unknown>> = Map<keyof Events, EventHandlerList<Events[keyof Events]>>;

type Atom<T> = {
  key: string;
  default: T;
};

type GlobalAtom<T> = {
  key: string;
  default: T;
  get: () => T;
  set: (value: any) => void;
  sub: (handle: Dispatch<T>) => void;
}

const emmiter = <Events extends Record<EventType, unknown>>(
  all: EventHandlerMap<Events> = new Map()
) => ({
  all,
  on: <Key extends keyof Events>(
    type: Key,
    handler: Handler<Events[keyof Events]>,
    handlers: EventHandlerList<Events[keyof Events]> | undefined = all.get(type)) =>
    handlers ? handlers.push(handler) : all.set(type, [handler] as EventHandlerList<Events[keyof Events]>)
  ,
  off: <Key extends keyof Events>(
    type: Key,
    handler: Handler<Events[keyof Events]>,
    handlers: EventHandlerList<Events[keyof Events]> | undefined = all.get(type)) =>
    handlers && handler ? handlers.splice(handlers.indexOf(handler) >>> 0, 1) : all.set(type, [])
  ,
  emit: <Key extends keyof Events>(
    type: Key,
    evt?: Events[Key],
    handlers: EventHandlerList<Events[keyof Events]> | undefined = all.get(type)) =>
    handlers && evt && handlers.slice().map((handler) => handler(evt))
}),
  context = {
    store: new Map<string, any>(),
    emmit: emmiter<Record<string, any>>()
  },
  stateAtom = <T>(opt: Atom<T>): GlobalAtom<T> => ({
    key: opt.key,
    default: opt.default,
    get: () => context.store.get(opt.key) || opt.default,
    set: (value) => context.store.set(opt.key, value),
    sub: (handler) => {
      context.emmit.on(opt.key, handler);
      return () => context.emmit.off(opt.key, handler);
    }
  });

export const
  atom = <T>(opt: Atom<T>) => stateAtom(opt),
  useGlobalValue = <T>(state: GlobalAtom<T>): T => {
    const [value, dispatch] = useState(state.get());
    useLayoutEffect(() => state.sub(dispatch), []);
    return value;
  },
  useSetGlobalState = <T>(state: GlobalAtom<T>): (value: T) => void => (value: T) => context.emmit.emit(state.key, value),
  useGlobalState = <T>(state: GlobalAtom<T>): [T, (value: T) => void] => [useGlobalValue(state), useSetGlobalState(state)],
  useFreeGlobalState = <T>(state: GlobalAtom<T>): [{ current: T }, (value: T) => void] => [useGlobalUnSubscribe(state), useSetGlobalState(state)],
  useGlobalUnSubscribe = <T>(state: GlobalAtom<T>): { current: T } => {
    const value = useRef<T>(context.store.get(state.key));
    useLayoutEffect(() => state.sub((v: T) => { value.current = v }), []);
    return value;
  };
