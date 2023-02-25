import { getter, setter } from "../dist"
import { COUNT } from "./testData"

test("setter", () => {

  expect(getter(COUNT)).toBe(0);

  setter(COUNT, 1);

  expect(getter(COUNT)).toBe(1);

  setter(COUNT, (value) => value + 1);

  expect(getter(COUNT)).toBe(2);

})