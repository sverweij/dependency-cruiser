const $dependencyCruiserManifest = require("../../../package.json");
const { toSourceLocationArray } = require("./helpers");
const {
  getSourceFolderCandidates,
  getTestFolderCandidates,
  hasTestsWithinSource
} = require("./helpers");

module.exports = function normalizeInitOptions(pInitOptions) {
  let lReturnValue = {
    version: $dependencyCruiserManifest.version,
    date: new Date().toJSON(),
    configType: "self-contained",
    ...pInitOptions
  };

  if (lReturnValue.configType === "preset" && !lReturnValue.preset) {
    lReturnValue.preset = "dependency-cruiser/configs/recommended-warn-only";
  }
  if (lReturnValue.useYarnPnP) {
    lReturnValue.externalModuleResolutionStrategy = "yarn-pnp";
  }
  lReturnValue.sourceLocation = toSourceLocationArray(
    lReturnValue.sourceLocation || getSourceFolderCandidates()
  );
  lReturnValue.testLocation = toSourceLocationArray(
    lReturnValue.testLocation || getTestFolderCandidates()
  );
  lReturnValue.hastestsOutsideSource = !hasTestsWithinSource(
    lReturnValue.testLocation,
    lReturnValue.sourceLocation
  );

  return lReturnValue;
};
