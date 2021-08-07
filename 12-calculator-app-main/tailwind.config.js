// @ts-check

const { fontFamily, colors } = require("tailwindcss/defaultTheme")
const plugin = require("tailwindcss/plugin")

module.exports = {
	purge: ["**/*.html"],
	mode: "jit",
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {},
		colors: {
			black: colors.black,
			white: colors.white,
			transparent: colors.transparent,

			// Theme 1
			"very-dark-desat-blue": {
				1: "hsl(222, 26%, 31%)",
				2: "hsl(223, 31%, 20%)",
				3: "hsl(224, 36%, 15%)",
			},
			"desat-dark-blue": {
				1: "hsl(225, 21%, 49%)",
				2: "hsl(224, 28%, 35%)",
			},
			red: "hsl(6, 63%, 50%)",
			"dark-red": "hsl(6, 70%, 34%)",
			"light-grayish-orange": "hsl(30, 25%, 89%)",
			"grayish-orange": "hsl(28, 16%, 65%)",
			"very-dark-grayish-blue": "hsl(221, 14%, 31%)",

			// Theme 2
			"light-gray": "hsl(0, 0%, 90%)",
			"grayish-red": "hsl(0, 5%, 81%)",
			"very-light-gray": "hsl(0, 0%, 93%)",
			"dark-mod-cyan": "hsl(185, 42%, 37%)",
			"very-dark-cyan": "hsl(185, 58%, 25%)",
			orange: "hsl(25, 98%, 40%)",
			"dark-orange": "hsl(25, 99%, 27%)",
			"light-grayish-yellow": "hsl(45, 7%, 89%)",
			"dark-grayish-orange": "hsl(35, 11%, 61%)",

			// Theme 3
			"very-dark-violet": {
				1: "hsl(268, 75%, 9%)",
				2: "hsl(268, 71%, 12%)",
				3: "hsl(268, 47%, 21%)",
			},
			"dark-violet": "hsl(281, 89%, 26%)",
			"vivid-magenta": "hsl(285, 91%, 52%)",
			"pure-cyan": "hsl(176, 100%, 44%)",
			"soft-cyan": "hsl(177, 92%, 70%)",
			"dark-magenta": "hsl(290, 70%, 36%)",
		},
		fontFamily: {
			body: ["Spartan", ...fontFamily.sans],
		},
	},
	variants: {
		extend: {
			// All variants are enabled in JIT mode, so no need for this.
			// colors: ["theme-1", "theme-2", "theme-3"],
		},
	},
	plugins: [
		// Auto-prefix utils with 'theme-1', 'theme-2', and 'theme-3'.
		plugin(function ({ addVariant, e }) {
			addVariant("theme-1", ({ modifySelectors, separator }) => {
				modifySelectors(({ className }) => {
					return `.${e(`theme-1${separator}${className}`)}`
				})
			})

			addVariant("theme-2", ({ modifySelectors, separator }) => {
				modifySelectors(({ className }) => {
					return `.${e(`theme-1${separator}${className}`)}`
				})
			})

			addVariant("theme-3", ({ modifySelectors, separator }) => {
				modifySelectors(({ className }) => {
					return `.${e(`theme-1${separator}${className}`)}`
				})
			})
		}),
	],
}
