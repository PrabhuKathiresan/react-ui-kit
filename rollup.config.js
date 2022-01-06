import fs from 'fs'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import typescript from 'rollup-plugin-typescript2'
import filesize from 'rollup-plugin-filesize'
import localResolve from 'rollup-plugin-local-resolve'
import { terser } from 'rollup-plugin-terser'
import autoprefixer from 'autoprefixer'
import url from 'rollup-plugin-url'
import svgr from '@svgr/rollup'
import bundleScss from 'rollup-plugin-bundle-scss'
import sass from 'rollup-plugin-sass'
import postcss from 'postcss'

import packageJson from './package.json'

const production = process.env.BUILD === 'production'

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
    bundleScss({ output: '../react-ui-kit.scss' }),
    sass({
      processor: css => postcss([autoprefixer]).process(css, { from: undefined }).then(result => result.css),

      output(styles, styleNodes) {
        fs.writeFileSync('lib/react-ui-kit.css', styles);
      }
    }),
    url(),
    svgr(),
    localResolve(),
    resolve(),
    commonjs(),
    typescript(),
    filesize(),
    production && terser()
  ]
}
