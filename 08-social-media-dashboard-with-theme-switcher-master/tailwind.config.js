const { colors, fontFamily, spacing } = require("tailwindcss/defaultTheme");

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ["./*.html"],
  theme: {
    extend: {
      borderWidth: {
        "5": "5px",
      },
      borderRadius: {
        xl: "1rem",
      },
      letterSpacing: {
        widest: "0.3em",
      },
      translate: {
        "6-less-2px": `calc(${spacing["6"]} - 2px)`,
      },
    },
    container: {
      center: true,
      padding: spacing["5"],
    },
    colors: {
      tranparent: colors.transparent,
      white: colors.white,
      black: colors.black,
      gray: colors.gray,
      "lime-green": "hsl(163, 72%, 41%)",
      "bright-red": "hsl(356, 69%, 56%)",
      blue: {
        "very-dark": "hsl(230, 17%, 14%)",
        "very-dark-2": "hsl(232, 19%, 15%)",
        "desaturated-dark": "hsl(228, 28%, 20%)",
        desaturated: "hsl(228, 34%, 66%)",
        "very-pale": "hsl(225, 100%, 98%)",
        "gray-light": "hsl(227, 47%, 96%)",
        "gray-dark": "hsl(228, 12%, 44%)",
      },
      facebook: "hsl(208, 92%, 53%)",
      twitter: "hsl(203, 89%, 53%)",
      "instagram-1": "hsl(37, 97%, 70%)",
      "instagram-2": "hsl(329, 70%, 58%)",
      youtube: "hsl(348, 97%, 39%)",
      toggle: "hsl(230, 22%, 74%)",
      "toggle-1": "hsl(210, 78%, 56%)",
      "toggle-2": "hsl(146, 68%, 55%)",
    },
    fontFamily: {
      sans: ["Inter", ...fontFamily.sans],
    },
    fontWeight: {
      normal: 400,
      bold: 700,
    },
  },
  variants: {},
  plugins: [],
};
