import { readFileSync, readdirSync, accessSync, statSync, R_OK } from "node:fs";
import { join } from "node:path";
import { DEFAULT_CONFIG_FILE_NAME } from "../defaults.mjs";

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
 * @param {import("fs").PathOrFileDescriptor} pManifestFileName - the file name where the package manifest (package.json) lives
 * @returns {Record<string,any>} - the contents of said manifest as a javascript object
 * @throws {ENOENT} when the manifest wasn't found
 * @throws {SyntaxError} when the manifest's json is invalid
 */
export function readManifest(pManifestFileName = "./package.json") {
  return JSON.parse(readFileSync(pManifestFileName, "utf8"));
}

/**
 * We could have used utl.fileExists - but that one is cached.
 * Not typically what we want for this util.
 *
 * @param {import("fs").PathLike} pFile
 * @returns {boolean}
 */
export function fileExists(pFile) {
  try {
    accessSync(pFile, R_OK);
  } catch (pError) {
    return false;
  }
  return true;
}

/**
 * @returns {boolean}
 */
function babelIsConfiguredInManifest() {
  let lReturnValue = false;

  try {
    // @ts-expect-error defaultly tsc doesn't know about newfangled stuff like hasOwn
    lReturnValue = Object.hasOwn(readManifest(), "babel");
  } catch (pError) {
    // silently ignore - we'll return false anyway then
  }
  return lReturnValue;
}

/**
 * @returns {boolean}
 */
export function isTypeModule() {
  let lReturnValue = false;

  try {
    lReturnValue = (readManifest()?.type ?? "commonjs") === "module";
  } catch (pError) {
    // silently ignore - we'll return false anyway then
  }

  return lReturnValue;
}

/**
 * @param {string} pFolderName
 * @returns {string[]} Array of folder names
 */
function getFolderNames(pFolderName) {
  return readdirSync(pFolderName, "utf8").filter((pFileName) =>
    statSync(join(pFolderName, pFileName)).isDirectory(),
  );
}

/**
 * @param {RegExp} pPattern
 * @param {string=} pFolderName
 * @returns {string[]}
 */
function getMatchingFileNames(pPattern, pFolderName = process.cwd()) {
  return readdirSync(pFolderName, "utf8").filter(
    (pFileName) =>
      statSync(join(pFolderName, pFileName)).isFile() &&
      pFileName.match(pPattern),
  );
}

/**
 * @param {string[]} pFolderNames
 * @returns {boolean}
 */
export function isLikelyMonoRepo(pFolderNames = getFolderNames(process.cwd())) {
  return pFolderNames.includes("packages");
}

export function hasTestsWithinSource(pTestLocations, pSourceLocations) {
  return pTestLocations.every((pTestLocation) =>
    pSourceLocations.includes(pTestLocation),
  );
}

export function getFolderCandidates(pCandidateFolderArray) {
  return (pFolderNames = getFolderNames(process.cwd())) => {
    return pFolderNames.filter((pFolderName) =>
      pCandidateFolderArray.includes(pFolderName),
    );
  };
}

/**
 * @param {string[]|string} pLocations
 * @returns {string[]}
 */
export function toSourceLocationArray(pLocations) {
  if (!Array.isArray(pLocations)) {
    return pLocations.split(",").map((pFolder) => pFolder.trim());
  }
  return pLocations;
}

/**
 * @returns {string[]}
 */
function getManifestFilesWithABabelConfig() {
  return babelIsConfiguredInManifest() ? ["package.json"] : [];
}

export const getBabelConfigCandidates = () =>
  getManifestFilesWithABabelConfig().concat(
    getMatchingFileNames(BABEL_CONFIG_CANDIDATE_PATTERN),
  );
export const hasBabelConfigCandidates = () =>
  getBabelConfigCandidates().length > 0;

export const getTSConfigCandidates = (pFolderName = process.cwd()) =>
  getMatchingFileNames(TSCONFIG_CANDIDATE_PATTERN, pFolderName);
export const hasTSConfigCandidates = (pFolderName = process.cwd()) =>
  getTSConfigCandidates(pFolderName).length > 0;
export const getJSConfigCandidates = (pFolderName = process.cwd()) =>
  getMatchingFileNames(JSCONFIG_CANDIDATE_PATTERN, pFolderName);
export const hasJSConfigCandidates = (pFolderName = process.cwd()) =>
  getJSConfigCandidates(pFolderName).length > 0;

export const getWebpackConfigCandidates = () =>
  getMatchingFileNames(WEBPACK_CANDIDATE_PATTERN);
export const hasWebpackConfigCandidates = () =>
  getWebpackConfigCandidates().length > 0;

export const getSourceFolderCandidates = getFolderCandidates(
  LIKELY_SOURCE_FOLDERS,
);
export const getTestFolderCandidates = getFolderCandidates(LIKELY_TEST_FOLDERS);

export const getMonoRepoPackagesCandidates = getFolderCandidates(
  LIKELY_PACKAGES_FOLDERS,
);

/**
 * @returns {string}
 */
export function getDefaultConfigFileName() {
  return isTypeModule() ? ".dependency-cruiser.cjs" : DEFAULT_CONFIG_FILE_NAME;
}
