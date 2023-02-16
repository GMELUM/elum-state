# [![GitHub license](https://badgen.net/badge/license/MIT/blue)](https://github.com/GMELUM/elum-state/blob/master/LICENSE) [![npm bundle size](https://img.shields.io/bundlephobia/min/elum-state)](https://bundlephobia.com/result?p=elum-state) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/elum-state)](https://bundlephobia.com/result?p=elum-state)

# elum-state
Elum State - A state management library for React
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

### setter
This is the function that updates the atom, initializes the render of components subscribed to the mutable state. Does not require use in functional components.
```jsx
import { setter, useGlobalValue } from "elum-state";
const COUNT = atom({ key:  "count",  default:  0  });

const App = () => {  
	const state = useGlobalValue(COUNT);

	const handleClick = () => {
		setter(COUNT, (value) => value + 1);
		// OR
		setter(COUNT, count + 1);
	}

	return  (<div onClick={handleClick}>{state}</div>); 
};
```

### getter
This is a function that receives the value of an atom. Does not require use in functional components.
```jsx
import { getter, useGlobalValue } from "elum-state";
const COUNT = atom({ key:  "count",  default:  0  });

const App = () => {  
	const state = useGlobalValue(COUNT);

	const handleClick = () => {
		const count = getter(COUNT, (value) => value + 1);
		console.log(count);
	}

	return  (<div onClick={handleClick}>{state}</div>); 
};
```

### useGlobalState
This API is similar to the React [`useState()`](https://reactjs.org/docs/hooks-reference.html#usestate) hook except it takes a Global State state instead of a default value as an argument. It returns a tuple of the current value of the state and a setter function. The setter function may either take a new value as an argument or an updater function which receives the previous value as a parameter.
```jsx
import { useGlobalState } from "elum-state";
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
import { useGlobalValue } from "elum-state";
const EXAMPLE_ATOM = atom({ key: "example_atom", default: "" });

const App = () => {
	const state = useGlobalValue(EXAMPLE_ATOM);
	return (<div>{state}</div>);
};
```

### useSetGlobalState
Returns a setter function for updating the value of writeable global state.
```jsx
import { useSetGlobalState } from "elum-state";
const EXAMPLE_ATOM = atom({ key: "example_atom", default: "" });

const App = () => {
	const setState = useSetGlobalState(EXAMPLE_ATOM);
	return (<div onClick={() => setState("hello")}></div>);
};
```

### useUnSubGlobalState
This API is similar to the React [`useState()`](https://reactjs.org/docs/hooks-reference.html#usestate) hook except it takes a Global State state instead of a default value as an argument. It returns a tuple of the current value of the state and a setter function. The setter function may either take a new value as an argument or an updater function which receives the previous value as a parameter. This hook will not subscribe the component to re-render if there are changing in the global state.

```jsx
import { useUnSubGlobalState } from "elum-state";
const EXAMPLE_ATOM = atom({ key: "example_atom", default: "" });

const App = () => {
	const [state, setState] = useUnSubGlobalState(EXAMPLE_ATOM);
	return (<div>{state}</div>);
};
```

### useUnSubGlobalValue
Returns the value of the given global state.
This hook will not subscribe the component to re-render if there are changing in the global state.
```jsx
import { useUnSubGlobalValue } from "elum-state";
const EXAMPLE_ATOM = atom({ key: "example_atom", default: "" });

const App = () => {
	const state = useUnSubGlobalValue(EXAMPLE_ATOM);
	return (<div>{state}</div>);
};
```
