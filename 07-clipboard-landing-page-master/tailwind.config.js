const { colors, fontFamily, fontWeight } = require("tailwindcss/defaultTheme");

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    enabled: true,
    content: ["./*.html"],
  },
  theme: {
    extend: {},
    colors: {
      transparent: colors.transparent,
      white: colors.white,
      black: colors.black,
      gray: {
        ...colors.gray,
        blue: "hsl(201, 11%, 66%)",
        "blue-dark": "hsl(210, 10%, 33%)",
      },
      "cyan-strong": "hsl(171, 66%, 44%)",
      "blue-light": "hsl(233, 100%, 69%)",
    },
    fontFamily: {
      sans: ["Bai Jamjuree", ...fontFamily.sans],
    },
    fontWeight: {
      normal: fontWeight.normal,
      semibold: fontWeight.semibold,
    },
  },
  variants: {},
  plugins: [],
};
