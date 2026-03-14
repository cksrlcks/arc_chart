import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import babel from "@rollup/plugin-babel";
import postcss from 'rollup-plugin-postcss';

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/arc-chart.js",
      format: "umd",
      name: "ArcChart",
      globals: { "chart.js/auto": "Chart" },
    },
    {
      file: "dist/arc-chart.min.js",
      format: "umd",
      name: "ArcChart",
      plugins: [terser()],
      globals: { "chart.js/auto": "Chart" },
    },
    {
      file: "dist/arc-chart.esm.js",
      format: "esm",
    },
  ],
  external: ["chart.js/auto"],
  plugins: [
    resolve(),
    commonjs(),
    postcss({
      extract: true,
      minimize: true,
    }),
    babel({ babelHelpers: "bundled" }),
  ],
};
