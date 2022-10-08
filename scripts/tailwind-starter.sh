#!/usr/bin/env bash

# TAILWINDCSS v3.x STARTER FOR VSCODE
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


# Add npm start and build scripts to package.json
# NOTE: The spacing here doesn't matter; npm reformats the file after installing stuff
sed -i -r 's/("scripts": \{)/\1"start": "npx tailwindcss -i main.css -o output.css --watch","build": "npx tailwindcss -i main.css -o output.css --minify",/' package.json


# Install prettier for formatting
# npm install prettier


# Install dependencies
npm install tailwindcss


# Create Tailwind config
npx tailwindcss init


# Specify content extensions in Tailwind config
sed -i 's|content: \[\],|content: \["./*.html"\],|' tailwind.config.js


# Create Tailwind .css source file
echo "@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
}

@layer components {
}

@layer utilities {
}
" > main.css


# Make Prettier use longer lines for HTML files
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
