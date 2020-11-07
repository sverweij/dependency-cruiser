const _get = require("lodash/get");
const _has = require("lodash/has");

const SHAREABLE_OPTIONS = [
  "combinedDependencies",
  "doNotFollow",
  "exclude",
  "externalModuleResolutionStrategy",
  "focus",
  "includeOnly",
  "maxDepth",
  "moduleSystems",
  "outputTo",
  "outputType",
  "prefix",
  "preserveSymlinks",
  "rulesFile",
  "tsPreCompilationDeps",
  // "tsConfig", TODO enableify
  "webpackConfig",
  "babelConfig",
  "exoticallyRequired",
  "exoticRequireStrings",
  "reporterOptions",
  "enhancedResolveOptions",
  "collapse",
];

function makeOptionsPresentable(pOptions) {
  return SHAREABLE_OPTIONS.filter(
    (pOption) => _has(pOptions, pOption) && pOptions[pOption] !== 0
  )
    .filter(
      (pOption) =>
        pOption !== "doNotFollow" ||
        Object.keys(pOptions.doNotFollow).length > 0
    )
    .filter(
      (pOption) =>
        pOption !== "exclude" || Object.keys(pOptions.exclude).length > 0
    )
    .reduce((pAll, pOption) => {
      pAll[pOption] = pOptions[pOption];
      return pAll;
    }, {});
}

function makeIncludOnlyBackwardsCompatible(pOptions) {
  return pOptions.includeOnly
    ? {
        ...pOptions,
        includeOnly: _get(pOptions, "includeOnly.path"),
      }
    : pOptions;
}

module.exports = function summarizeOptions(pFileDirectoryArray, pOptions) {
  return {
    optionsUsed: {
      ...makeOptionsPresentable(makeIncludOnlyBackwardsCompatible(pOptions)),
      args: pFileDirectoryArray.join(" "),
    },
  };
};
/* eslint security/detect-object-injection: 0 */
