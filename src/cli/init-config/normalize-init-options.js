const $dependencyCruiserManifest = require("../../../package.json");
const { toSourceLocationArray } = require("./helpers");
const {
  getSourceFolderCandidates,
  getTestFolderCandidates,
  hasTestsWithinSource,
} = require("./helpers");

function populate(pInitOptions) {
  return {
    version: $dependencyCruiserManifest.version,
    date: new Date().toJSON(),
    configType: "self-contained",
    ...pInitOptions,
    sourceLocation: toSourceLocationArray(
      pInitOptions.sourceLocation || getSourceFolderCandidates()
    ),
    testLocation: toSourceLocationArray(
      pInitOptions.testLocation || getTestFolderCandidates()
    ),
  };
}

module.exports = function normalizeInitOptions(pInitOptions) {
  let lReturnValue = populate(pInitOptions);

  if (lReturnValue.configType === "preset" && !lReturnValue.preset) {
    lReturnValue.preset = "dependency-cruiser/configs/recommended-warn-only";
  }
  if (lReturnValue.useYarnPnP) {
    lReturnValue.externalModuleResolutionStrategy = "yarn-pnp";
  }
  if (
    !Object.prototype.hasOwnProperty.call(lReturnValue, "hasTestsOutsideSource")
  ) {
    lReturnValue.hasTestsOutsideSource = !hasTestsWithinSource(
      lReturnValue.testLocation,
      lReturnValue.sourceLocation
    );
  }
  return lReturnValue;
};
