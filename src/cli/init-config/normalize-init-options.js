const _has = require("lodash/has");
const $dependencyCruiserManifest = require("../../../package.json");
const {
  getSourceFolderCandidates,
  getTestFolderCandidates,
  hasTestsWithinSource,
  toSourceLocationArray,
} = require("./environment-helpers");

/**
 *
 * @param {import("../../../types/init-config").IPartialInitConfig} pInitOptions
 * @return {import("../../../types/init-config").IPartialInitConfig}
 */
function populate(pInitOptions) {
  return {
    version: $dependencyCruiserManifest.version,
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
 * @param {import("../../../types/init-config").IPartialInitConfig} pInitOptions
 * @return {import("../../../types/init-config").IInitConfig}
 */
module.exports = function normalizeInitOptions(pInitOptions) {
  let lReturnValue = populate(pInitOptions);

  if (lReturnValue.configType === "preset" && !lReturnValue.preset) {
    lReturnValue.preset = "dependency-cruiser/configs/recommended-warn-only";
  }
  if (!_has(lReturnValue, "hasTestsOutsideSource")) {
    lReturnValue.hasTestsOutsideSource =
      !pInitOptions.isMonoRepo &&
      !hasTestsWithinSource(
        lReturnValue.testLocation,
        lReturnValue.sourceLocation
      );
  }
  return lReturnValue;
};
