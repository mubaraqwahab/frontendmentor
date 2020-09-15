// Credit: https://www.meidev.co/blog/visual-studio-code-css-linting-with-tailwind/
module.exports = {
  extends: ["stylelint-config-recommended"],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "apply",
          "layer",
          "variants",
          "responsive",
          "screen",
        ],
      },
    ],
    "declaration-block-trailing-semicolon": null,
    "no-descending-specificity": null,
    "no-duplicate-selectors": null,
    "block-no-empty": null,
  },
};
