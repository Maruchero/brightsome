// Converts SASS code into CSS
import fs from "fs";
import path from "path";
import glob from "glob";
import sass from "sass";

const sourcePath = "style";
const buildPath = "build";

// Clear build directory
if (fs.existsSync(buildPath)) fs.rmSync(buildPath, { recursive: true });

// Get list of source files
let p = path.join(sourcePath, "**/*").replaceAll(path.sep, "/");
glob(p, (err, files) => {
  if (err) {
    console.error(err);
  } else {
    // Build files
    for (let file of files) {
      if (fs.lstatSync(file).isDirectory()) continue;

      // Extract source and build paths data
      let dirname = path.dirname(file);
      let basename = path.basename(file);

      let dir = dirname.substring(sourcePath.length); // Path relative to sourcePath
      let { name, ext } = path.parse(basename);

      let newPath = path.join(buildPath, dir);
      let newName = ext == ".sass" ? name + ".css" : basename;

      // Create dir if necessary
      if (!fs.existsSync(newPath)) fs.mkdirSync(newPath);

      // Build file if it's a SASS file, otherwise just copy it
      const data =
        ext == ".sass" ? sass.compile(file).css : fs.readFileSync(file);
      fs.writeFileSync(path.join(newPath, newName), data);
    }
  }
});
