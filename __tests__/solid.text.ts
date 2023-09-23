import { atom, getter, setter } from "../src/solid"

const COUNT = atom({ key: "solid_count", default: 0 });
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

])("test_solid", (_, func) => func())