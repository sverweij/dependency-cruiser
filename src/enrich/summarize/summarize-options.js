const _get = require("lodash/get");
const _has = require("lodash/has");

const SHAREABLE_OPTIONS = [
  "combinedDependencies",
  "doNotFollow",
  "exclude",
  "externalModuleResolutionStrategy",
  "focus",
  "includeOnly",
  "knownViolations",
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
    (pShareableOptionKey) =>
      _has(pOptions, pShareableOptionKey) && pOptions[pShareableOptionKey] !== 0
  )
    .filter(
      (pShareableOptionKey) =>
        pShareableOptionKey !== "doNotFollow" ||
        Object.keys(pOptions.doNotFollow).length > 0
    )
    .filter(
      (pShareableOptionKey) =>
        pShareableOptionKey !== "exclude" ||
        Object.keys(pOptions.exclude).length > 0
    )
    .filter(
      (pShareableOptionKey) =>
        pShareableOptionKey !== "knownViolations" ||
        pOptions.knownViolations.length > 0
    )
    .reduce((pAll, pShareableOptionKey) => {
      // console.error(pOption);
      pAll[pShareableOptionKey] = pOptions[pShareableOptionKey];
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
