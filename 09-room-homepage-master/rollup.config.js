import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

export default {
  input: "js/index.js",
  output: {
    file: "js/bundle.js",
    format: "iife",
    sourcemap: true,
  },
  plugins: [
    resolve(),
    ...(process.env.NODE_ENV === "production" ? [terser()] : []),
  ],
};
