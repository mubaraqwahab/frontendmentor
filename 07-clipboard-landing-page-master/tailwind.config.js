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
    extend: {
      padding: {
        "28": "7rem",
      },
    },
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
      "cyan-stronger": "hsl(171, 66%, 34%)",
      "blue-light": "hsl(233, 100%, 69%)",
      "blue-dark": "hsl(233, 100%, 59%)",
    },
    container: {
      center: true,
      padding: "1.5rem",
    },
    fontFamily: {
      sans: ["Bai Jamjuree", ...fontFamily.sans],
    },
    fontWeight: {
      normal: fontWeight.normal,
      semibold: fontWeight.semibold,
    },
  },
  variants: {
    // Disable responsive container variants
    container: [],
  },
  corePlugins: {
    animation: false,
  },
  plugins: [],
};
