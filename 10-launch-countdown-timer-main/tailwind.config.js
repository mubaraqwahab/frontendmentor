const { colors, fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
	purge: ["./*.html"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {},
		colors: {
			transparent: colors.transparent,
			white: colors.white,
			black: colors.black,
			blue: {
				gray: "hsl(237, 18%, 59%)",
				"dark-desaturated": "hsl(236, 21%, 26%)",
				"very-dark": "hsl(235, 16%, 14%)",
				black: "hsl(234, 17%, 12%)",
			},
			red: {
				soft: "hsl(345, 95%, 68%)",
			},
		},
		fontFamily: {
			sans: ["Red Hat Text", ...fontFamily.sans],
		},
		backgroundImage: {
			stars: "url(images/bg-stars.svg)",
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
