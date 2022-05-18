const path = require("path");
/**
 *
 * @param {string} pFileDirectory
 * @returns {string}
 */
function relativize(pFileDirectory) {
  // if pFileDirectory === process.cwd() path.relative will yield an empty string
  // whereas we actually want something non-empty => hence normalize
  // the thing
  return path.isAbsolute(pFileDirectory)
    ? path.normalize(path.relative(process.cwd(), pFileDirectory))
    : pFileDirectory;
}

/**
 *
 * @param {string[]} pFileAndDirectoryArray
 * @returns {string[]}
 */
module.exports = function normalizeFileAndDirectoryArray(
  pFileAndDirectoryArray
) {
  return pFileAndDirectoryArray.map(relativize);
};
