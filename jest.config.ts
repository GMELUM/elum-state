import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: "jsdom",
  verbose: true,
  roots: [
    "./__tests__"
  ]
};

export default config;