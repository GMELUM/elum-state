import { createContext, createElement, FC, HTMLAttributes, useContext, useLayoutEffect, useRef, useState } from "react";

type EventType = string | symbol;
type Handler<T = unknown> = (event: T) => void;
type EventHandlerList<T = unknown> = Array<Handler<T>>;
type EventHandlerMap<Events extends Record<EventType, unknown>> = Map<keyof Events, EventHandlerList<Events[keyof Events]>>;
type Atom<T> = {
  key: string;
  default: T;
};

interface RootStateProps extends HTMLAttributes<HTMLDivElement> { }

const emmiter = <Events extends Record<EventType, unknown>>(
  all: EventHandlerMap<Events> = new Map()
) => ({
  all,
  on: <Key extends keyof Events>(type: Key, handler: Handler<Events[keyof Events]>) => {
    const handlers: Array<Handler<Events[keyof Events]>> | undefined = all.get(type);
    handlers ? handlers.push(handler) : all.set(type, [handler] as EventHandlerList<Events[keyof Events]>);
  },
  off: <Key extends keyof Events>(type: Key, handler?: Handler<Events[keyof Events]>) => {
    const handlers: Array<Handler<Events[keyof Events]>> | undefined = all.get(type);
    handlers && handler ?
      handlers.splice(handlers.indexOf(handler) >>> 0, 1) :
      all.set(type, []);
  },
  emit: <Key extends keyof Events>(type: Key, evt?: Events[Key]) => {
    let handlers = all.get(type);
    handlers && evt && (handlers as EventHandlerList<Events[keyof Events]>)
      .slice().map((handler) => handler(evt));
  }
});

const context = {
  store: new Map(),
  emmit: emmiter<Record<string, any>>()
};

const GlobalStateContext = createContext(context);

const atom = <T>(opt: Atom<T>): Atom<T> => opt;

const useFreeGlobalState = <T>(atom: Atom<T>): [{ current: T }, (value: T) => void] =>
  [useGlobalUnSubscribe(atom), useSetGlobalState(atom)]

const useGlobalState = <T>(atom: Atom<T>): [T, (value: T) => void] =>
  [useGlobalValue(atom), useSetGlobalState(atom)]

const useGlobalUnSubscribe = <T>(atom: Atom<T>): { current: T } => {
  const context = useContext(GlobalStateContext);
  if (!context) { throw new Error('This component must be used inside a <RootState> component.') }
  if (!context.store.has(atom.key)) { context.store.set(atom.key, atom.default) }
  const value = useRef<T>(context.store.get(atom.key));
  const handlerDispatch = (v: T) => {
    value.current = v;
  };
  useLayoutEffect(() => {
    context.emmit.on(atom.key, handlerDispatch);
    return () => context.emmit.off(atom.key, handlerDispatch);
  }, [])
  return value;
}

const useGlobalValue = <T>(atom: Atom<T>): T => {
  const context = useContext(GlobalStateContext);
  if (!context) { throw new Error('This component must be used inside a <RootState> component.') }
  if (!context.store.has(atom.key)) { context.store.set(atom.key, atom.default) }
  const value = context.store.get(atom.key);
  const [state, dispatch] = useState(value);
  useLayoutEffect(() => {
    context.emmit.on(atom.key, dispatch);
    return () => context.emmit.off(atom.key, dispatch);
  }, []);
  return state;
}

const useSetGlobalState = <T>(atom: Atom<T>): (value: T) => void => {
  const context = useContext(GlobalStateContext);
  if (!context) { throw new Error('This component must be used inside a <RootState> component.') }
  if (!context.store.has(atom.key)) { context.store.set(atom.key, atom.default) }
  return (value: T) => context.emmit.emit(atom.key, value);
}

const RootState: FC<RootStateProps> = ({ children }) =>
  (createElement(GlobalStateContext.Provider, { value: context }, children));

export {
  RootState,
  atom,
  emmiter,
  useGlobalState,
  useGlobalValue,
  useSetGlobalState,
  useFreeGlobalState,
  useGlobalUnSubscribe,
};
