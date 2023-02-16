import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

import terser from '@rollup/plugin-terser';

import { RollupOptions } from "rollup";

const external = ["react"]

const config: RollupOptions[] = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: `dist/index.js`,
        format: 'cjs',
        sourcemap: false,
      },
      {
        file: `dist/index.mjs`,
        format: 'es',
        sourcemap: false,
      },
    ],
    external: (name) => external.includes(name),
    plugins: [esbuild(), terser()]
  },
  {
    input: 'src/index.ts',
    external: (name) => external.includes(name),
    plugins: [dts()],
    output: {
      file: `dist/index.d.ts`,
      format: 'es',
    },
  }
]

export default config;
