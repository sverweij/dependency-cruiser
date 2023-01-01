const { readFileSync, mkdirSync, writeFileSync } = require("fs");
const { join } = require("path");
const meta = require("../extract/transpile/meta");
const { optionsAreCompatible } = require("./options-compatible");
const { getRevisionData, revisionDataEqual } = require("./git-revision-data");

const CACHE_FILE_NAME = "cache.json";
let gRevisionData = null;

/**
 * @param {string} pCacheFolder
 * @param {import("../..").ICruiseResult} pCruiseResult
 * @param {import("../..").IRevisionData=} pRevisionData
 */
function writeCache(pCacheFolder, pCruiseResult, pRevisionData) {
  const lRevisionData = pRevisionData ?? gRevisionData;

  mkdirSync(pCacheFolder, { recursive: true });
  writeFileSync(
    join(pCacheFolder, CACHE_FILE_NAME),
    JSON.stringify(
      lRevisionData
        ? {
            ...pCruiseResult,
            revisionData: lRevisionData,
          }
        : pCruiseResult
    ),
    "utf8"
  );
  gRevisionData = null;
}

/**
 * @param {string} pCacheFolder
 * @returns {import("../..").ICruiseResult}
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
 * @param {import("../../types/strict-options").IStrictCruiseOptions} pOptions
 * @param {import("../..").ICruiseResult} pCachedCruiseResult
 * @param {import("../..").IRevisionData=} pRevisionData
 * @returns {boolean}
 */
function canServeFromCache(pOptions, pCachedCruiseResult, pRevisionData) {
  gRevisionData =
    pRevisionData ??
    getRevisionData(
      new Set(meta.scannableExtensions.concat(pOptions.extraExtensionsToScan))
    );
  return (
    revisionDataEqual(pCachedCruiseResult.revisionData, gRevisionData) &&
    optionsAreCompatible(pCachedCruiseResult.summary.optionsUsed, pOptions)
  );
}

function clearCache() {
  gRevisionData = null;
}

module.exports = {
  writeCache,
  readCache,
  canServeFromCache,
  clearCache,
};
