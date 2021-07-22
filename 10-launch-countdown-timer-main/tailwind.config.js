const { colors, fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
	purge: ["./*.html"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			letterSpacing: {
				"0.3": "0.3em",
			},
			flex: {
				full: "1 0 100%",
			},
			fontSize: {
				"2xs": "0.7rem",
			},
			boxShadow: {
				b: "0 8px 4px -4px hsla(234, 17%, 12%, 1)",
			},
			minWidth: {
				"1/2": "50%",
			},
		},
		colors: {
			transparent: colors.transparent,
			white: colors.white,
			black: colors.black,
			blue: {
				gray: "hsl(237, 18%, 59%)",
				"dark-desaturated": "hsl(236, 21%, 26%)",
				"darker-desaturated": "hsl(236, 21%, 20%)",
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
			hills: "url(images/pattern-hills.svg)",
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
