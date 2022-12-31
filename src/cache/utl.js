const { deepEqual } = require("assert");
const { createHash } = require("crypto");
const { readFileSync } = require("fs");
/**
 *
 * @param {any} pLeftObject
 * @param {any} pRightObject
 * @returns {boolean}
 */
function objectsAreEqual(pLeftObject, pRightObject) {
  try {
    deepEqual(pLeftObject, pRightObject);
    return true;
  } catch (pError) {
    return false;
  }
}

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

module.exports = { objectsAreEqual, getFileHash };
