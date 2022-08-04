import { FC, HTMLAttributes } from "react";
declare type EventType = string | symbol;
declare type Handler<T = unknown> = (event: T) => void;
declare type EventHandlerList<T = unknown> = Array<Handler<T>>;
declare type EventHandlerMap<Events extends Record<EventType, unknown>> = Map<keyof Events, EventHandlerList<Events[keyof Events]>>;
declare type Atom<T> = {
    key: string;
    default: T;
};
interface RootStateProps extends HTMLAttributes<HTMLDivElement> {
}
declare const emmiter: <Events extends Record<EventType, unknown>>(all?: EventHandlerMap<Events>) => {
    all: EventHandlerMap<Events>;
    on: <Key extends keyof Events>(type: Key, handler: Handler<Events[keyof Events]>) => void;
    off: <Key_1 extends keyof Events>(type: Key_1, handler?: Handler<Events[keyof Events]> | undefined) => void;
    emit: <Key_2 extends keyof Events>(type: Key_2, evt?: Events[Key_2] | undefined) => void;
};
declare const atom: <T>(opt: Atom<T>) => Atom<T>;
declare const useFreeGlobalState: <T>(atom: Atom<T>) => [{
    current: T;
}, (value: T) => void];
declare const useGlobalState: <T>(atom: Atom<T>) => [T, (value: T) => void];
declare const useGlobalUnSubscribe: <T>(atom: Atom<T>) => {
    current: T;
};
declare const useGlobalValue: <T>(atom: Atom<T>) => T;
declare const useSetGlobalState: <T>(atom: Atom<T>) => (value: T) => void;
declare const RootState: FC<RootStateProps>;
export { RootState, atom, emmiter, useGlobalState, useGlobalValue, useSetGlobalState, useFreeGlobalState, useGlobalUnSubscribe, };
