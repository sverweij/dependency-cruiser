const { createHash } = require("crypto");
const { readFileSync } = require("fs");
const memoize = require("lodash/memoize");

/**
 * @param {string} pString
 * @returns {string}
 */
function hash(pString) {
  return createHash("sha1").update(pString).digest("base64");
}

/**
 * @param {import("fs").PathOrFileDescriptor} pFileName
 * @returns {string}
 */
function _getFileHash(pFileName) {
  try {
    return hash(readFileSync(pFileName, "utf8"));
  } catch (pError) {
    return "file not found";
  }
}

module.exports = { getFileHash: memoize(_getFileHash) };
