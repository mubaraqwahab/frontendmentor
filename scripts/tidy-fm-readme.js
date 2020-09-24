#!/usr/bin/env node

/**
 * Tidy Frontend Mentor README
 * This script updates a Frontend Mentor challenge's README.
 * It moves most of the content into a <details> element
 */

const fs = require("fs");
const path = require("path");

const firstArg = process.argv[2];

if (!firstArg || firstArg === "-h" || firstArg === "--help") {
  console.log("Usage:");
  console.log("  tidy-readme <path/to/frontendmentor/README> ...");
  console.log("  tidy-readme [-h|--help]");
} else {
  for (const readme of process.argv.slice(2)) {
    // Read the lines of the README into an array
    // Credit: https://stackoverflow.com/a/6832105/12695621
    const readmeLines = fs
      .readFileSync(path.resolve(__dirname, readme))
      .toString()
      .split("\n");

    // Only tidy frontendmentor readmes!
    if (readmeLines[0].startsWith("# Frontend Mentor - ")) {
      const detailsOpenTag = "<details>";
      const summary =
        "<summary>The default README for this challenge.</summary>";
      const detailsCloseTag = "</details>";

      // Insert the opening <details> tag and
      // the summary element into the 5th and 6th lines
      // The empty string is for an empty line. (This is required so the markdown is rendered correctly)
      readmeLines.splice(4, 0, detailsOpenTag, summary, "");

      // Append the closing <details> tag
      // Empty line here isn't necessary, but ...
      readmeLines.push(detailsCloseTag, "");

      // Concat the lines into a string:
      const modifiedReadmeContent = readmeLines.reduce(
        (content, line) => `${content}${line}\n`,
        ""
      );

      // Write the content back into the file
      fs.writeFileSync(readme, modifiedReadmeContent);

      console.log(`"${readme}" has been tidied!`);
    } else {
      console.log(
        `"${readme}" doesn't look like a Frontend Mentor challenge README`
      );
    }
  }
}
