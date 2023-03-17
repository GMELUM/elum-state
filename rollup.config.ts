import { RollupOptions } from "rollup";
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import terser from '@rollup/plugin-terser';
import copy from "rollup-plugin-copy";

const external = ["react"];

const config: RollupOptions[] = [
  {
    input: 'src/index.ts',
    treeshake: false,
    output: [
      {
        file: `dist/index.mjs`,
        format: 'es',
        sourcemap: false,
      },
      {
        file: `dist/index.js`,
        format: 'cjs',
        sourcemap: false,
      }
    ],
    external: (name) => external.includes(name),
    plugins: [esbuild(), terser()]
  },
  {
    input: 'src/index.ts',
    external: (name) => external.includes(name),
    plugins: [dts(), copy({
      targets: [
        { src: "LICENSE", dest: "dist" },
        { src: "README.md", dest: "dist" },
        { src: "package.npm.json", dest: "dist", rename: "package.json" }
      ]
    })],
    output: {
      file: `dist/index.d.ts`,
      format: 'es',
    },
  }
]

export default config;
