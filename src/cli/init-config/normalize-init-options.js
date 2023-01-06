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
 *
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
  if (lReturnValue.specifyResolutionExtensions) {
    const lFoldersToScan = lReturnValue.sourceLocation.concat(
      lReturnValue.testLocation
    );
    lReturnValue.resolutionExtensions = findExtensions(
      lFoldersToScan.length > 0 ? lFoldersToScan : ["."]
    );
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
