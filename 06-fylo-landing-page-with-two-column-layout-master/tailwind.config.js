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
      width: {
        "1/8": "12.5%",
        "1/10": "10%",
      },
      minWidth: {
        "3/7": ((3 * 100) / 7).toFixed(6) + "%",
      },
      padding: {
        "36": "9rem",
      },
      flexGrow: {
        "2": "2",
      },
    },
    container: {
      center: true,
      padding: spacing["5"],
    },
    colors: {
      transparent: colors.transparent,
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
        "bright-dark": "hsl(224, 93%, 48%)",
      },
      cyan: {
        default: "hsl(170, 45%, 43%)",
        dark: "hsl(170, 45%, 33%)",
      },
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
