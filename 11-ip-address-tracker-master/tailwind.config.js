const { fontFamily, fontWeight } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./*.html"],
	theme: {
		fontFamily: {
			sans: ["Rubik", ...fontFamily.sans],
		},
		fontWeight: {
			normal: fontWeight.normal, // 400
			medium: fontWeight.medium, // 500
			bold: fontWeight.bold, // 700
		},
		colors: {
			white: "white",
			black: "black",
			transparent: "transparent",
			gray: {
				dark: "hsl(0, 0%, 59%)",
				"very-dark": "hsl(0, 0%, 17%)",
			},
		},
		extend: {
			container: {
				center: true,
				padding: "1.5rem",
			},
		},
	},
	plugins: [],
};
