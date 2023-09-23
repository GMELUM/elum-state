import { atom, getter, setter } from "../src/react"

const COUNT = atom({ key: "react_count", default: 0 });
const NAME = atom<string>({ key: "react_count" });

test.each([

  ["check", () => expect(getter(COUNT)).toBe(0)],

  ["edit", () => {
    setter(COUNT, 2);
    expect(getter(COUNT)).toBe(2);
  }],

  ["add", () => {
    setter(COUNT, (value) => value + 1);
    expect(getter(COUNT)).toBe(3);
  }],

  ["reset", () => {
    setter(COUNT, undefined);
    expect(getter(COUNT)).toBe(0)
  }],

  ["empty", () => {
    expect(getter(NAME)).toBe(undefined)
  }]

])("test_react", (_, func) => func())