import { COUNT } from "./testData"

test("atom", () => {
  expect({
    key: COUNT.k,
    default: COUNT.d
  }).toMatchObject({
    key: "count",
    default: 0
  })
})