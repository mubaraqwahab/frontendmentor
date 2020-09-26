const { fontFamily, spacing } = require("tailwindcss/defaultTheme");

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ["./*.html"],
  theme: {
    extend: {},
    container: {
      center: true,
      padding: spacing["8"],
    },
    colors: {
      red: "hsl(0, 100%, 68%)",
      blue: {
        "very-dark": "hsl(230, 29%, 20%)",
        "gray-dark": "hsl(230, 11%, 40%)",
        gray: "hsl(231, 7%, 65%)",
        "gray-light": "hsl(207, 33%, 95%)",
      },
    },
    fontFamily: {
      display: ["Barlow Condensed", ...fontFamily.sans],
      body: ["Barlow", ...fontFamily.sans],
    },
    fontWeight: {
      normal: 400,
      bold: 700,
    },
  },
  variants: {},
  plugins: [],
};
