const has = require("lodash/has");
const { version } = require("../../../src/meta.js");
const {
  getSourceFolderCandidates,
  getTestFolderCandidates,
  hasTestsWithinSource,
  toSourceLocationArray,
} = require("./environment-helpers");

/**
 *
 * @param {import("./types").IPartialInitConfig} pInitOptions
 * @return {import("./types").IPartialInitConfig}
 */
function populate(pInitOptions) {
  return {
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
