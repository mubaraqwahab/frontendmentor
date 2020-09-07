const { colors, fontFamily, spacing } = require("tailwindcss/defaultTheme");

module.exports = {
  purge: {
    enabled: true,
    content: ["./*.html"],
  },
  theme: {
    extend: {
      boxShadow: {
        md: "0 5px 3px 0 rgba(0, 0, 0, 0.05)",
        box: "0 0px 10px 5px rgba(0, 0, 0, 0.05)",
      },
    },
    container: {
      center: true,
      padding: spacing["5"],
    },
    colors: {
      white: colors.white,
      gray: {
        ...colors.gray,
        "blue-light": "hsl(240, 75%, 98%)",
        light: "hsl(0, 0%, 75%)",
      },
      blue: {
        "very-dark": "hsl(243, 87%, 12%)",
        desaturated: "hsl(238, 22%, 44%)",
        bright: "hsl(224, 93%, 58%)",
      },
      cyan: "hsl(170, 45%, 43%)",
    },
    backgroundImage: {
      "curve-mobile": "url(images/bg-curve-mobile.svg)",
      "curve-desktop": "url(images/bg-curve-desktop.svg)",
    },
    fontFamily: {
      accent: ["Raleway", ...fontFamily.sans],
      body: ["Open Sans", ...fontFamily.sans],
    },
    fontWeight: {
      normal: "400",
      bold: "700",
    },
  },
  variants: {},
  future: {
    removeDeprecatedGapUtilities: true,
  },
  plugins: [],
};
