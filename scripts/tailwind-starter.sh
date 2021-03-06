#!/usr/bin/env bash

# TAILWINDCSS v1.x STARTER FOR VSCODE
# This script is for automating my TailwindCSS setup in VSCode.


# Usage message
# See https://stackoverflow.com/a/23930212/12695621
read -r -d '' USAGE << EOM
Usage:
  tailwind-starter <directory>
  tailwind-starter [-h|--help]
EOM


# Show usage message if no arg is given or help flag -h (or --help) is given
if [ -z "$@" ] || [ "$1" = "-h" ] || [ "$1" = "--help" ]
then
  echo "$USAGE" && exit 0
else
  # Create the directory if it doesn't exist
  mkdir -p $1
  cd $1
fi


# Create package.json
npm init -y


# Add npm start script to package.json
# NOTE: The spacing here actually doesn't matter.
# NPM would reformat the file after installing stuff
sed -i -r 's/("scripts": \{)/\1"start": "postcss main.css --output output.css --watch","build": "NODE_ENV=production postcss main.css --output output.css",/' package.json


# Install prettier for formatting
# npm install prettier


# Install dependencies
npm install postcss-cli postcss tailwindcss autoprefixer cssnano
npm install --save-dev stylelint-config-recommended


# Create Tailwind config
npx tailwind init


# Add HTML purge rule to Tailwind config
sed -i 's|purge: \[\],|purge: \["./*.html"\],|' tailwind.config.js


# PostCSS config
echo "module.exports = {
  plugins: [
    require(\"tailwindcss\"),
    require(\"autoprefixer\"),
    process.env.NODE_ENV === \"production\" &&
      require(\"cssnano\")({
        preset: \"default\",
      }),
  ],
};" > postcss.config.js


# Create Tailwind .css source file
echo "@tailwind base;
@tailwind components;
@tailwind utilities;
@layer base {
}
@layer components {
}
@layer utilities {
}" > main.css


# Disable VSCode's CSS lint
mkdir -p .vscode/
echo "{
  \"css.validate\": false
}" > .vscode/settings.json


# Stylelint config for TailwindCSS + VSCode
echo "// Credit: https://www.meidev.co/blog/visual-studio-code-css-linting-with-tailwind/
module.exports = {
  extends: [\"stylelint-config-recommended\"],
  rules: {
    \"at-rule-no-unknown\": [
      true,
      {
        ignoreAtRules: [
          \"tailwind\",
          \"apply\",
          \"layer\",
          \"variants\",
          \"responsive\",
          \"screen\",
        ],
      },
    ],
    \"declaration-block-trailing-semicolon\": null,
    \"no-descending-specificity\": null,
    \"no-duplicate-selectors\": null,
    \"block-no-empty\": null,
  },
};" > stylelint.config.js


# Tell Prettier to use longer lines for HTML files
echo "{
  \"overrides\": [
    {
      \"files\": \"*.html\",
      \"options\": {
        \"printWidth\": 150
      }
    }
  ]
}" > .prettierrc

# Git ignore node_modules
# NOTE: Don't ignore generated (CSS and JS) files so it's available for GitHub Pages
echo "node_modules" > .gitignore
