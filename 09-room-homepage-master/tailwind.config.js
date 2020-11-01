const { colors, fontFamily, spacing } = require("tailwindcss/defaultTheme");

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ["./*.html"],
  theme: {
    extend: {
      order: {
        "0": 0,
      },
      letterSpacing: {
        ultrawide: "0.8em",
      },
      inset: {
        "50": "50%",
      },
    },
    container: {
      padding: spacing["8"],
      center: true,
    },
    colors: {
      transparent: colors.transparent,
      white: colors.white,
      black: colors.black,
      gray: {
        dark: "hsl(0, 0%, 63%)",
        "very-dark": "hsl(0, 0%, 27%)",
      },
    },
    fontFamily: {
      sans: ["Spartan", ...fontFamily.sans],
    },
    fontWeight: {
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  variants: {
    backgroundColor: ({ after }) => after(["disabled"]),
    cursor: ({ after }) => after(["disabled"]),
  },
  plugins: [],
};
