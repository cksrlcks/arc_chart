import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import babel from "@rollup/plugin-babel";
import postcss from "rollup-plugin-postcss";
import typescript from "@rollup/plugin-typescript";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";

const isDev = process.env.ROLLUP_WATCH === "true";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/arc-chart.js",
      format: "umd",
      name: "ArcChart",
      globals: { "chart.js/auto": "Chart" },
      sourcemap: isDev,
    },
    {
      file: "dist/arc-chart.min.js",
      format: "umd",
      name: "ArcChart",
      plugins: [terser()],
      globals: { "chart.js/auto": "Chart" },
      sourcemap: isDev,
    },
    {
      file: "dist/arc-chart.esm.js",
      format: "esm",
      sourcemap: isDev,
    },
  ],
  external: ["chart.js/auto"],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "dist/types",
    }),
    postcss({
      extract: true,
      minimize: true,
    }),
    babel({
      babelHelpers: "bundled",
      extensions: [".js", ".ts"],
    }),
    isDev &&
      serve({
        open: true,
        contentBase: [".", "dist", "example"],
        port: 3000,
      }),
    isDev && livereload("dist"),
  ],
};
