const { colors, fontFamily, spacing } = require("tailwindcss/defaultTheme")

/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
	future: {
		removeDeprecatedGapUtilities: true,
		purgeLayersByDefault: true,
	},
	purge: ["./*.html"],
	theme: {
		extend: {
			spacing: {
				"36": "9rem",
			},
			boxShadow: {
				"outline-red": "0 0 0 3px hsla(0, 87%, 67%, 0.5)",
			},
			inset: {
				full: "100%",
				"1/2": "50%",
			},
			margin: {
				"22": "5.5rem",
			},
			transitionDuration: {
				"400": "400ms",
			},
		},
		container: {
			center: true,
			padding: {
				default: spacing["5"],
				lg: spacing["8"],
			},
		},
		colors: {
			transparent: colors.transparent,
			white: colors.white,
			black: colors.black,
			cyan: {
				default: "hsl(180, 66%, 49%)",
				light: "hsl(180, 66%, 70%)",
			},
			violet: {
				dark: "hsl(257, 27%, 26%)",
				"very-dark": "hsl(260, 8%, 14%)",
			},
			red: "hsl(0, 87%, 67%)",
			gray: {
				...colors.gray,
				default: "hsl(0, 0%, 75%)",
				violet: "hsl(257, 7%, 63%)",
			},
			blue: {
				"very-dark": "hsl(255, 11%, 22%)",
			},
		},
		backgroundImage: {
			"shorten-mobile": "url(images/bg-shorten-mobile.svg)",
			"shorten-desktop": "url(images/bg-shorten-desktop.svg)",
			"boost-mobile": "url(images/bg-boost-mobile.svg)",
			"boost-desktop": "url(images/bg-boost-desktop.svg)",
		},
		fontFamily: {
			sans: ["Poppins", ...fontFamily.sans],
		},
		fontWeight: {
			medium: 500,
			bold: 700,
		},
	},
	variants: {
		transitionProperty: ["responsive", "motion-safe", "motion-reduce"],
	},
	plugins: [],
}
