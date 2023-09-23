import { RollupOptions } from "rollup";
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import terser from '@rollup/plugin-terser';
import copy from "rollup-plugin-copy";

const external = ["react"];

const config: RollupOptions[] = [
  {
    input: 'src/react/index.ts',
    treeshake: false,
    output: [
      {
        file: `dist/react/index.mjs`,
        format: 'es',
        sourcemap: false,
      },
      {
        file: `dist/react/index.js`,
        format: 'cjs',
        sourcemap: false,
      }
    ],
    external: (name) => external.includes(name),
    plugins: [esbuild(), terser()]
  },
  {
    input: 'src/solid/index.ts',
    external: (name) => external.includes(name),
    plugins: [dts(), copy({
      targets: [
        { src: "LICENSE", dest: "dist" },
        { src: "README.md", dest: "dist" },
        { src: "package.npm.json", dest: "dist", rename: "package.json" },
        { src: "src/react/package.json", dest: "dist", rename: "react/package.json" }
      ]
    })
    ],
    output: {
      file: `dist/react/index.d.ts`,
      format: 'es',
    },
  }
]

export default config;
