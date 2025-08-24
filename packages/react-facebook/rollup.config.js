const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('rollup-plugin-typescript2');
const external = require('rollup-plugin-peer-deps-external');
const dts = require('rollup-plugin-dts');
const packageJson = require('./package.json');

module.exports = [
  {
      input: 'src/index.ts',
      output: [
          {
              file: packageJson.main,
              format: 'cjs',
              sourcemap: true,
              name: 'react-ts-lib'
          },
          {
              file: packageJson.module,
              format: 'esm',
              sourcemap: true
          }
      ],
      plugins: [
          external(),
          resolve(),
          commonjs(),
          typescript({
            useTsconfigDeclarationDir: true
          })
      ],
  },
  {
      input: 'dist/types/index.d.ts',
      output: [{ file: 'dist/index.d.ts', format: "esm" }],
      external: [/\.css$/],
      plugins: [dts.default()],
  },
];
