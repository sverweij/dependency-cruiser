const has = require("lodash/has");
const { version } = require("../../../src/meta.js");
const {
  getSourceFolderCandidates,
  getTestFolderCandidates,
  hasTestsWithinSource,
  toSourceLocationArray,
} = require("./environment-helpers");
const findExtensions = require("./find-extensions.js");

/**
 * @param {import("./types").IInitConfig} pInitOptions
 * @param {string[]} pExtensions
 * @returns {boolean}
 */
function usesTypeScript(pInitOptions, pExtensions) {
  return Boolean(
    pInitOptions.tsConfig ||
      pInitOptions.tsPreCompilationDeps ||
      (pExtensions || []).some((pExtension) =>
        [".ts", ".tsx", ".d.ts", ".mts", ".d.mts", ".cts", ".d.cts"].includes(
          pExtension
        )
      )
  );
}

/**
 * @param {import("./types").IInitConfig} pInitOptions
 * @returns {string[]}
 */
function getExtensions(pInitOptions) {
  let lFoldersToScan = pInitOptions.sourceLocation;

  if (pInitOptions.hasTestsOutsideSource) {
    lFoldersToScan = lFoldersToScan.concat(pInitOptions.testLocation);
  }
  return findExtensions(lFoldersToScan.length > 0 ? lFoldersToScan : ["."]);
}

/**
 * @param {import("./types").IPartialInitConfig} pInitOptions
 * @return {import("./types").IPartialInitConfig}
 */
function populate(pInitOptions) {
  const lReturnValue = {
    version,
    date: new Date().toJSON(),
    configType: "self-contained",
    ...pInitOptions,
    sourceLocation: toSourceLocationArray(
      pInitOptions.sourceLocation || getSourceFolderCandidates()
    ),
    testLocation: pInitOptions.isMonoRepo
      ? []
      : toSourceLocationArray(
          pInitOptions.testLocation || getTestFolderCandidates()
        ),
  };
  const lExtensions = getExtensions(lReturnValue);
  lReturnValue.usesTypeScript = usesTypeScript(pInitOptions, lExtensions);

  if (lReturnValue.specifyResolutionExtensions) {
    lReturnValue.resolutionExtensions = lExtensions;
  }
  return lReturnValue;
}

/**
 *
 * @param {import("./types").IPartialInitConfig} pInitOptions
 * @return {import("./types").IInitConfig}
 */
module.exports = function normalizeInitOptions(pInitOptions) {
  let lReturnValue = populate(pInitOptions);

  if (lReturnValue.configType === "preset" && !lReturnValue.preset) {
    lReturnValue.preset = "dependency-cruiser/configs/recommended-warn-only";
  }
  if (!has(lReturnValue, "hasTestsOutsideSource")) {
    lReturnValue.hasTestsOutsideSource =
      !pInitOptions.isMonoRepo &&
      !hasTestsWithinSource(
        lReturnValue.testLocation,
        lReturnValue.sourceLocation
      );
  }
  return lReturnValue;
};
