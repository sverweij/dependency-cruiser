const { createHash } = require("crypto");
const { readFileSync } = require("fs");

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
function getFileHash(pFileName) {
  try {
    return hash(readFileSync(pFileName, "utf8"));
  } catch (pError) {
    return "file not found";
  }
}

module.exports = { getFileHash };
