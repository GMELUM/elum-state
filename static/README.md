# [![GitHub license](https://badgen.net/badge/license/MIT/blue)](https://github.com/GMELUM/elum-state/blob/master/LICENSE) [![npm bundle size](https://img.shields.io/bundlephobia/min/elum-state)](https://bundlephobia.com/result?p=elum-state)

# elum-state
Reactive global state management library with an emphasis on minimalism.
## Installation
> YARN

	yarn add elum-state
> NPM

	npm i -s elum-state

## Getting Started
### Atom
An **atom** represents a piece of **state**. Atoms can be read from and written to from any component. Components that read the value of an atom are implicitly **subscribed** to that atom, so any atom updates will result in a re-render of all components subscribed to that atom:
```jsx
const EXAMPLE_ATOM = atom({
	key: "example_atom", // unique ID key value
	default: "" // default value
});
```

### useGlobalState
This API is similar to the React [`useState()`](https://reactjs.org/docs/hooks-reference.html#usestate) hook except it takes a Global State state instead of a default value as an argument. It returns a tuple of the current value of the state and a setter function. The setter function may either take a new value as an argument or an updater function which receives the previous value as a parameter.
```jsx
const EXAMPLE_ATOM = atom({ key: "example_atom", default: "" });

const App = () => {
	const [state, setState] = useGlobalState(EXAMPLE_ATOM);
	return (<div>{state}</div>);
};
```

### useGlobalValue
Returns the value of the given global state.
This hook will subscribe the component to re-render if there are changing in the global state.

```jsx
const EXAMPLE_ATOM = atom({ key: "example_atom", default: "" });

const App = () => {
	const state = useGlobalValue(EXAMPLE_ATOM);
	return (<div>{state}</div>);
};
```

### useSetGlobalState
Returns a setter function for updating the value of writeable global state.
```jsx
const EXAMPLE_ATOM = atom({ key: "example_atom", default: "" });

const App = () => {
	const setState = useSetGlobalState(EXAMPLE_ATOM);
	return (<div onClick={() => setState("hello")}></div>);
};
```

### useFreeGlobalState
This API is similar to the React [`useState()`](https://reactjs.org/docs/hooks-reference.html#usestate) hook except it takes a Global State state instead of a default value as an argument. It returns a tuple of the current value of the state and a setter function. The setter function may either take a new value as an argument or an updater function which receives the previous value as a parameter. This hook will not subscribe the component to re-render if there are changing in the global state.

```jsx
const EXAMPLE_ATOM = atom({ key: "example_atom", default: "" });

const App = () => {
	const [state, setState] = useFreeGlobalState(EXAMPLE_ATOM);
	return (<div>{state}</div>);
};
```

### useGlobalUnSubscribe
Returns the value of the given global state.
This hook will not subscribe the component to re-render if there are changing in the global state.
```jsx
const EXAMPLE_ATOM = atom({ key: "example_atom", default: "" });

const App = () => {
	const state = useGlobalUnSubscribe(EXAMPLE_ATOM);
	return (<div>{state}</div>);
};
```
## License
elum-team is [MIT license](./LICENSE).