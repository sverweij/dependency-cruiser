import { isAbsolute, normalize, relative } from "node:path";

/**
 * @param {string} pFileDirectory
 * @returns {string}
 */
function relativize(pFileDirectory) {
  // if pFileDirectory === process.cwd() path.relative will yield an empty string
  // whereas we actually want something non-empty => hence normalize
  // the thing
  return isAbsolute(pFileDirectory)
    ? normalize(relative(process.cwd(), pFileDirectory))
    : pFileDirectory;
}

/**
 * @param {string[]} pFileAndDirectoryArray
 * @returns {string[]}
 */
export default function normalizeFileAndDirectoryArray(pFileAndDirectoryArray) {
  return pFileAndDirectoryArray.map(relativize);
}
