import resolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import {terser} from "rollup-plugin-terser"
import replace from "@rollup/plugin-replace"

export default {
	input: "js/index.ts",
	output: {
		file: "js/bundle.js",
		format: "iife",
		sourcemap: true,
	},
	plugins: [
		resolve(),
		typescript(),
		replace({"process.env.NODE_ENV": `"production"`}),
		...(process.env.NODE_ENV === "production" ? [terser()] : []),
	],
}
