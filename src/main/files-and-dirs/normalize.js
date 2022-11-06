/* eslint-disable no-console */
const path = require("path").posix;
const pathToPosix = require("../../extract/utl/path-to-posix");

/**
 *
 * @param {string} pFileDirectory
 * @returns {string}
 */
function relativize(pFileDirectory) {
  // if pFileDirectory === process.cwd() path.relative will yield an empty string
  // whereas we actually want something non-empty => hence normalize
  // the thing
  console.error(
    "path.isAbsolute(pFileDirectory)",
    path.isAbsolute(pFileDirectory)
  );
  return path.isAbsolute(pFileDirectory)
    ? path.normalize(path.relative(pathToPosix(process.cwd()), pFileDirectory))
    : pFileDirectory;
}

function tee(pThing) {
  console.error(pThing);
  return pThing;
}

/**
 *
 * @param {string[]} pFileAndDirectoryArray
 * @returns {string[]}
 */
module.exports = function normalizeFileAndDirectoryArray(
  pFileAndDirectoryArray
) {
  return pFileAndDirectoryArray.map(relativize).map(tee);
};
