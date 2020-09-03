const { fontFamily, colors, spacing } = require("tailwindcss/defaultTheme");

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
  },
  purge: {
    enabled: true,
    content: ["./index.html"],
  },
  theme: {
    extend: {
      backgroundImage: {
        "hero-mobile": "url(images/bg-hero-mobile.svg)",
        "hero-desktop": "url(images/bg-hero-desktop.svg)",
      },
      borderRadius: {
        xl: "1rem",
      },
      width: {
        "44": "11rem",
        "160": "40rem",
        "9/20": "45%",
        "11/20": "55%",
      },
      padding: {
        "36": "9rem",
      },
    },
    container: {
      center: true,
      padding: spacing["3"],
    },
    fontFamily: {
      heading: ["Poppins", ...fontFamily.sans],
      body: ["Open Sans", ...fontFamily.sans],
    },
    fontWeight: {
      normal: "400",
      semibold: "600",
      bold: "700",
    },
    colors: {
      transparent: colors.transparent,
      white: colors.white,
      black: colors.black,
      gray: {
        ...colors.gray,
        blue: "hsl(208, 11%, 55%)",
      },
      pink: "hsl(322, 100%, 66%)",
      cyan: {
        pale: "hsl(193, 100%, 96%)",
        dark: "hsl(192, 100%, 9%)",
      },
    },
  },
  variants: {},
  plugins: [],
};
