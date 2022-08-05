# [![GitHub license](https://badgen.net/badge/license/MIT/blue)](https://github.com/GMELUM/elum-state/blob/master/LICENSE) [![npm bundle size](https://img.shields.io/bundlephobia/min/elum-state)](https://bundlephobia.com/result?p=elum-state) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/elum-state)](https://bundlephobia.com/result?p=elum-state)

## Язык: [RU](./README.RU.md) | [EN](./README.md)

# elum-state

Библиотека для управления глобальными состояниями в React.

## Установка
> YARN

	yarn add elum-state
> NPM

	npm i -s elum-state

## Использование
### Atom

**Атом** является частью глобальных состояний и используется для инициализации глобальных состояний.
Компоненты которые используют атомы могут быть подписаны на его обновление и будут перерисовываться.
```jsx
const EXAMPLE_ATOM = atom({
	key: "example_atom", // unique ID key value
	default: "" // default value
});
```

### useGlobalState

Этот хук похож на API React [`useState()`](https://reactjs.org/docs/hooks-reference.html#usestate) за исключением того что он приминает **Atom** для инициализации хука вместо значения по умолчанию. Хук возвращает массив с текущим состоянием и функцией для обновления глобального состояния.
```jsx
const EXAMPLE_ATOM = atom({ key: "example_atom", default: "" });

const App = () => {
	const [state, setState] = useGlobalState(EXAMPLE_ATOM);
	return (<div>{state}</div>);
};
```

### useGlobalValue


Возвращает значение данного глобального состояния.
Этот хук **подпишет** компонент на повторный рендеринг, если в глобальном состоянии произошли изменения.
```jsx
const EXAMPLE_ATOM = atom({ key: "example_atom", default: "" });

const App = () => {
	const state = useGlobalValue(EXAMPLE_ATOM);
	return (<div>{state}</div>);
};
```

### useSetGlobalState

Возвращает функцию для обновления глобального состояния.
```jsx
const EXAMPLE_ATOM = atom({ key: "example_atom", default: "" });

const App = () => {
	const setState = useSetGlobalState(EXAMPLE_ATOM);
	return (<div onClick={() => setState("hello")}></div>);
};
```

### useFreeGlobalState

Этот хук похож на API React [`useState()`](https://reactjs.org/docs/hooks-reference.html#usestate) за исключением того что он приминает **Atom** для инициализации хука вместо значения по умолчанию. Хук возвращает массив с текущим состоянием и функцией для обновления глобального состояния.

В отличии от **useGlobalState** хук не подписывает компонент на изменения глобального состояния, что позволяет избавится от повторных рендерингов.
```jsx
const EXAMPLE_ATOM = atom({ key: "example_atom", default: "" });

const App = () => {
	const [state, setState] = useFreeGlobalState(EXAMPLE_ATOM);
	return (<div>{state}</div>);
};
```
### useGlobalUnSubscribe


Возвращает значение данного глобального состояния.
Этот хук **не подпишет** компонент на повторный рендеринг, если в глобальном состоянии произошли изменения.
```jsx
const EXAMPLE_ATOM = atom({ key: "example_atom", default: "" });

const App = () => {
	const state = useGlobalUnSubscribe(EXAMPLE_ATOM);
	return (<div>{state}</div>);
};
```
## Лицензия

elum-state [MIT license](./LICENSE).