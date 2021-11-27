const path = require("path");

/**
 * Returns the extension of the given file name path.
 *
 * Just using path.extname would be fine for most cases,
 * except for coffeescript, where a markdown extension can
 * mean literate coffeescript, and for typescript where
 * .d.ts and .ts are slightly different beasts
 *
 * @param {string} pFileName path to the file to be parsed
 * @return {string}          extension
 */
module.exports = function getExtensions(pFileName) {
  if (pFileName.endsWith(".d.ts")) {
    return ".d.ts";
  }

  if (pFileName.endsWith(".coffee.md")) {
    return ".coffee.md";
  }

  return path.extname(pFileName);
};
