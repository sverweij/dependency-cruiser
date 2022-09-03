const { readFileSync, readdirSync, accessSync, statSync, R_OK } = require("fs");
const { join } = require("path");
const has = require("lodash/has");
const get = require("lodash/get");
const { DEFAULT_CONFIG_FILE_NAME } = require("../defaults");

const LIKELY_SOURCE_FOLDERS = ["src", "lib", "app", "bin", "sources"];
const LIKELY_TEST_FOLDERS = ["test", "spec", "tests", "specs", "bdd"];
const LIKELY_PACKAGES_FOLDERS = ["packages"];
const TSCONFIG_CANDIDATE_PATTERN = /.*tsconfig.*\.json$/gi;
const JSCONFIG_CANDIDATE_PATTERN = /.*jsconfig.*\.json$/gi;
const WEBPACK_CANDIDATE_PATTERN = /.*webpack.*\.(c?js|json5?|ts|ya?ml)$/gi;
const BABEL_CONFIG_CANDIDATE_PATTERN = /^\.babelrc$|.*babel.*\.json/gi;

/**
 * Read the package manifest ('package.json') and return it as a javascript object
 *
 * @param {string} pManifestFileName - the file name where the package manifest (package.json) lives
 * @returns {any} - the contents of said manifest as a javascript object
 * @throws {ENOENT} when the manifest wasn't found
 * @throws {SyntaxError} when the manifest's json is invalid
 */
function readManifest(pManifestFileName = "./package.json") {
  return JSON.parse(readFileSync(pManifestFileName, "utf8"));
}

/*
  We could have used utl.fileExists - but that one is cached.
  Not typically what we want for this util.
 */
function fileExists(pFile) {
  try {
    accessSync(pFile, R_OK);
  } catch (pError) {
    return false;
  }
  return true;
}

function babelIsConfiguredInManifest() {
  let lReturnValue = false;

  try {
    lReturnValue = has(readManifest(), "babel");
  } catch (pError) {
    // silently ignore - we'll return false anyway then
  }
  return lReturnValue;
}

function isTypeModule() {
  let lReturnValue = false;

  try {
    lReturnValue = get(readManifest(), "type", "commonjs") === "module";
  } catch (pError) {
    // silently ignore - we'll return false anyway then
  }

  return lReturnValue;
}

function getFolderNames(pFolderName) {
  return readdirSync(pFolderName, "utf8").filter((pFileName) =>
    statSync(join(pFolderName, pFileName)).isDirectory()
  );
}

function getMatchingFileNames(pPattern, pFolderName = process.cwd()) {
  return readdirSync(pFolderName, "utf8").filter(
    (pFileName) =>
      statSync(join(pFolderName, pFileName)).isFile() &&
      pFileName.match(pPattern)
  );
}

function isLikelyMonoRepo(pFolderNames = getFolderNames(process.cwd())) {
  return pFolderNames.includes("packages");
}

function hasTestsWithinSource(pTestLocations, pSourceLocations) {
  return pTestLocations.every((pTestLocation) =>
    pSourceLocations.includes(pTestLocation)
  );
}

function getFolderCandidates(pCandidateFolderArray) {
  return (pFolderNames = getFolderNames(process.cwd())) => {
    return pFolderNames.filter((pFolderName) =>
      pCandidateFolderArray.includes(pFolderName)
    );
  };
}

function toSourceLocationArray(pLocations) {
  if (!Array.isArray(pLocations)) {
    return pLocations.split(",").map((pFolder) => pFolder.trim());
  }
  return pLocations;
}

function getManifestFilesWithABabelConfig() {
  return babelIsConfiguredInManifest() ? ["package.json"] : [];
}

const getBabelConfigCandidates = () =>
  getManifestFilesWithABabelConfig().concat(
    getMatchingFileNames(BABEL_CONFIG_CANDIDATE_PATTERN)
  );
const hasBabelConfigCandidates = () => getBabelConfigCandidates().length > 0;

const getTSConfigCandidates = (pFolderName = process.cwd()) =>
  getMatchingFileNames(TSCONFIG_CANDIDATE_PATTERN, pFolderName);
const hasTSConfigCandidates = (pFolderName = process.cwd()) =>
  getTSConfigCandidates(pFolderName).length > 0;
const getJSConfigCandidates = (pFolderName = process.cwd()) =>
  getMatchingFileNames(JSCONFIG_CANDIDATE_PATTERN, pFolderName);
const hasJSConfigCandidates = (pFolderName = process.cwd()) =>
  getJSConfigCandidates(pFolderName).length > 0;

const getWebpackConfigCandidates = () =>
  getMatchingFileNames(WEBPACK_CANDIDATE_PATTERN);
const hasWebpackConfigCandidates = () =>
  getWebpackConfigCandidates().length > 0;

const getSourceFolderCandidates = getFolderCandidates(LIKELY_SOURCE_FOLDERS);
const getTestFolderCandidates = getFolderCandidates(LIKELY_TEST_FOLDERS);

const getMonoRepoPackagesCandidates = getFolderCandidates(
  LIKELY_PACKAGES_FOLDERS
);
function getDefaultConfigFileName() {
  return isTypeModule() ? ".dependency-cruiser.cjs" : DEFAULT_CONFIG_FILE_NAME;
}

module.exports = {
  readManifest,
  fileExists,
  toSourceLocationArray,
  isLikelyMonoRepo,
  isTypeModule,
  hasTestsWithinSource,
  getFolderCandidates,
  getBabelConfigCandidates,
  hasBabelConfigCandidates,
  getWebpackConfigCandidates,
  hasWebpackConfigCandidates,
  getTSConfigCandidates,
  hasTSConfigCandidates,
  getJSConfigCandidates,
  hasJSConfigCandidates,
  getSourceFolderCandidates,
  getTestFolderCandidates,
  getMonoRepoPackagesCandidates,
  getDefaultConfigFileName,
};
