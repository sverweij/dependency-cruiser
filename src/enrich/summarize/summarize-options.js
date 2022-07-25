const get = require("lodash/get");
const has = require("lodash/has");

const SHAREABLE_OPTIONS = [
  "babelConfig",
  "collapse",
  "combinedDependencies",
  "doNotFollow",
  "enhancedResolveOptions",
  "exclude",
  "exoticallyRequired",
  "exoticRequireStrings",
  "externalModuleResolutionStrategy",
  "focus",
  "focusDepth",
  "includeOnly",
  "knownViolations",
  "maxDepth",
  "moduleSystems",
  "outputTo",
  "outputType",
  "prefix",
  "preserveSymlinks",
  "reaches",
  "reporterOptions",
  "rulesFile",
  "tsPreCompilationDeps",
  "webpackConfig",
  // "metrics", TODO: should be enabled
  // "progress", TODO: could be enabled
  // "tsConfig", TODO: should be enabled
];

function makeOptionsPresentable(pOptions) {
  return SHAREABLE_OPTIONS.filter(
    (pShareableOptionKey) =>
      has(pOptions, pShareableOptionKey) && pOptions[pShareableOptionKey] !== 0
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
        includeOnly: get(pOptions, "includeOnly.path"),
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
