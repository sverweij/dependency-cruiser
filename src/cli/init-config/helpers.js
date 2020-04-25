const fs = require("fs");
const _get = require("lodash/get");

const LIKELY_SOURCE_FOLDERS = ["src", "lib", "app", "bin"];
const LIKELY_TEST_FOLDERS = ["test", "spec", "tests", "specs", "bdd"];

/**
 * Read the package manifest ('package.json') and return it as a javascript object
 *
 * @param {string} pManifestFileName - the file name where the package manifest (package.json) lives
 * @returns {any} - the contents of said manifest as a javascript object
 * @throws ENOENT when the manifest wasn't found
 * @throws SyntaxError when the manifest's json is invalid
 */
function readManifest(pManifestFileName = "./package.json") {
  return JSON.parse(fs.readFileSync(pManifestFileName, "utf8"));
}
/*
  We could have used utl.fileExists - but that one is cached.
  Not typically what we want for this util.
 */
function fileExists(pFile) {
  try {
    fs.accessSync(pFile, fs.R_OK);
  } catch (pError) {
    return false;
  }
  return true;
}

function pnpIsEnabled() {
  let lReturnValue = false;

  try {
    lReturnValue = _get(readManifest(), "installConfig.pnp", lReturnValue);
  } catch (pError) {
    // silently ignore - we'll return false anyway then
  }
  return lReturnValue;
}

function getFolderNames(pFolderName) {
  return fs
    .readdirSync(pFolderName, "utf8")
    .filter((pFileName) => fs.statSync(pFileName).isDirectory());
}

function isLikelyMonoRepo(pFolderNames = getFolderNames(".")) {
  return pFolderNames.some((pFolderName) => pFolderName === "packages");
}

function hasTestsWithinSource(pTestLocations, pSourceLocations) {
  return (
    pTestLocations.length === 0 ||
    pTestLocations.every((pTestLocation) =>
      pSourceLocations.some(
        (pSourceLocation) => pSourceLocation === pTestLocation
      )
    )
  );
}

function getFolderCandidates(pCandidateFolderArray) {
  return (pFolderNames = getFolderNames(".")) => {
    if (isLikelyMonoRepo(pFolderNames)) {
      // when it's likely a monorepo return what we used to return until
      // version 8.1.1. That way we won't break backwards compatibility
      return pCandidateFolderArray;
    }
    return pFolderNames.filter((pFolderName) =>
      pCandidateFolderArray.some(
        (pCandidateFolder) => pCandidateFolder === pFolderName
      )
    );
  };
}

function folderNameArrayToRE(pArrayOfStrings) {
  return `^(${pArrayOfStrings.join("|")})`;
}

function toSourceLocationArray(pLocations) {
  if (!Array.isArray(pLocations)) {
    return pLocations.split(",").map((pFolder) => pFolder.trim());
  }
  return pLocations;
}

function validateLocation(pLocations) {
  for (const lLocation of toSourceLocationArray(pLocations)) {
    try {
      if (!fs.statSync(lLocation).isDirectory()) {
        return `'${lLocation}' doesn't seem to be a folder - please try again`;
      }
    } catch (pError) {
      return `'${lLocation}' doesn't seem to exist - please try again`;
    }
  }

  return true;
}

module.exports = {
  LIKELY_SOURCE_FOLDERS,
  LIKELY_TEST_FOLDERS,
  folderNameArrayToRE,
  readManifest,
  fileExists,
  pnpIsEnabled,
  toSourceLocationArray,
  validateLocation,
  isLikelyMonoRepo,
  hasTestsWithinSource,
  getFolderCandidates,
  getSourceFolderCandidates: getFolderCandidates(LIKELY_SOURCE_FOLDERS),
  getTestFolderCandidates: getFolderCandidates(LIKELY_TEST_FOLDERS),
};
