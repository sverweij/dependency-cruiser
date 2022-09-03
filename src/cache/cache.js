const { readFileSync, mkdirSync, writeFileSync } = require("fs");
const { join } = require("path");
const { optionsAreCompatible } = require("./options-compatible");
const { revisionDataEqual } = require("./revision-data");

const CACHE_FILE_NAME = "cache.json";
/**
 *
 * @param {string} pCacheFolder
 * @param {import("../../types/cruise-result").ICruiseResult} pCruiseResult
 */
function writeCache(pCacheFolder, pCruiseResult) {
  mkdirSync(pCacheFolder, { recursive: true });
  writeFileSync(
    join(pCacheFolder, CACHE_FILE_NAME),
    JSON.stringify(pCruiseResult),
    "utf8"
  );
}

/**
 *
 * @param {string} pCacheFolder
 * @returns {import("../../types/cruise-result").ICruiseResult}
 */
function readCache(pCacheFolder) {
  try {
    return JSON.parse(
      readFileSync(join(pCacheFolder, CACHE_FILE_NAME), "utf8")
    );
  } catch (pError) {
    return { modules: [], summary: {} };
  }
}

/**
 *
 * @param {import("../../types/strict-options").IStrictCruiseOptions} pOptions
 * @param {import("../../types/cruise-result").IRevisionData} pRevisionData
 * @returns
 */
function canServeFromCache(pOptions, pRevisionData) {
  /** @type {import("../../types/cruise-result").ICruiseResult} */
  const lCachedResults = readCache(pOptions.cache);

  return (
    revisionDataEqual(lCachedResults.revisionData, pRevisionData) &&
    optionsAreCompatible(lCachedResults.summary.optionsUsed, pOptions)
  );
}

module.exports = {
  writeCache,
  readCache,
  canServeFromCache,
};
