import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import filesize from 'rollup-plugin-filesize';
import localResolve from 'rollup-plugin-local-resolve';
import { terser } from 'rollup-plugin-terser';
import autoprefixer from 'autoprefixer';
import url from 'rollup-plugin-url';
import svgr from '@svgr/rollup';

import packageJson from './package.json';

const production = process.env.BUILD === 'production';

export default {
  input: './src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs'
    },
    {
      file: packageJson.module,
      format: 'es'
    }
  ],
  plugins: [
    peerDepsExternal(),
    postcss({ plugins: [autoprefixer] }),
    url(),
    svgr(),
    localResolve(),
    resolve(),
    commonjs(),
    typescript(),
    filesize(),
    production && terser()
  ]
};
