import { COUNT } from "./testData"

test("atom", () => {
  expect({
    key: COUNT.key,
    default: COUNT.default
  }).toMatchObject({
    key: "count",
    default: 0
  })
})