const { fontFamily, spacing, colors } = require("tailwindcss/defaultTheme");

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ["./*.html"],
  theme: {
    extend: {
      padding: {
        "0.25": "0.0625rem",
      },
      letterSpacing: {
        "1": "0.15em",
        "2": "0.3em",
      },
      boxShadow: {
        outline: "0 0 0 3px hsla(0, 100%, 68%, 0.5)",
      },
      inset: {
        "6": spacing["6"],
        full: "100%",
      },
      width: {
        "screen-half": "50vw",
      },
      height: {
        "screen-half": "50vw",
      },
    },
    container: {
      center: true,
      padding: spacing["6"],
    },
    colors: {
      transparent: colors.transparent,
      white: colors.white,
      black: colors.black,
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
