var svgstore = require("svgstore");
var fs = require("fs");
var path = require("path");

var imagesDir = "./images/";

var sprites = fs
  .readdirSync(imagesDir)
  .filter(
    (filename) => filename.endsWith(".svg") && filename.startsWith("icon-")
  )
  .reduce(
    (sprites, svg) =>
      sprites.add(
        svg.slice(0, -4),
        fs.readFileSync(path.join(imagesDir, svg), "utf-8")
      ),
    svgstore()
  );

fs.writeFileSync(path.join(imagesDir, "icons.svg"), sprites);
