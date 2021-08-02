const { fontFamily, colors } = require("tailwindcss/defaultTheme")

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
			red: {
				DEFAULT: "hsl(6, 63%, 50%)",
				dark: "hsl(6, 70%, 34%)",
			},
		},
		fontFamily: {
			body: ["Spartan", ...fontFamily.sans],
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
}
