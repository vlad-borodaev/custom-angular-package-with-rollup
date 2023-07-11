import commonjs from "@rollup/plugin-commonjs";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import del from "rollup-plugin-delete";
import json from "@rollup/plugin-json";
import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import angular from 'rollup-plugin-angular';
import nodeResolve from 'rollup-plugin-node-resolve';
import alias from 'rollup-plugin-alias';
import { GLOBAL, globalsRegex } from 'rollup-globals-regex';

export default {
  input: "src/index.ts",
  output: [{
    inlineDynamicImports: true,
    dir: "lib/cjs",
    format: "cjs",
    sourcemap: true
  }],
  plugins: [
    del({ targets: "lib/*" }),
    resolve({
      preferBuiltins: true,
      modulesOnly: false,
    }),
    commonjs({
      esmExternals: true,
      transformMixedEsModules: true,
    }),
    peerDepsExternal(),
    angular(),
    typescript({
      tsconfig: "./tsconfig.json",
      useTsconfigDeclarationDir: true
    }),
    alias({ rxjs: __dirname + '/node_modules/rxjs-es' }), // rxjs fix (npm install rxjs-es)
    nodeResolve({ jsnext: true, main: true }),
    postcss({
      extract: "styles.css"
    }),
    json(),
  ],
  globals: globalsRegex({
    'tslib': 'tslib',
    [GLOBAL.NG2]: GLOBAL.NG2.TPL,
    [GLOBAL.RX]: GLOBAL.RX.TPL,
    [GLOBAL.RX_OBSERVABLE]: GLOBAL.RX_OBSERVABLE.TPL,
    [GLOBAL.RX_OPERATOR]: GLOBAL.RX_OPERATOR.TPL,
  }),
  external: (moduleId) => {
    if (/^(\@angular|rxjs)\//.test(moduleId)) {
      return true;
    }
    return false;
  }
  // external: [
  //   "classnames",
  //   "require",
  //   "prop-types-extra",
  // ],
};