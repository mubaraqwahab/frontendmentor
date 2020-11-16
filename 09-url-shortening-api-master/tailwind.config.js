const { colors, fontFamily, spacing } = require("tailwindcss/defaultTheme");

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ["./*.html"],
  theme: {
    extend: {
      padding: {
        "36": "9rem",
      },
    },
    container: {
      center: true,
      padding: spacing["5"],
    },
    colors: {
      transparent: colors.transparent,
      white: colors.white,
      black: colors.black,
      cyan: "hsl(180, 66%, 49%)",
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
};
