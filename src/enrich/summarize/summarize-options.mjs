const SHAREABLE_OPTIONS = [
  "babelConfig",
  "baseDir",
  "cache",
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
  "metrics",
  "moduleSystems",
  "outputTo",
  "outputType",
  "prefix",
  "preserveSymlinks",
  "reaches",
  "reporterOptions",
  "rulesFile",
  "tsConfig",
  "tsPreCompilationDeps",
  "webpackConfig",
  // "progress", TODO: could be enabled
];

function makeOptionsPresentable(pOptions) {
  return SHAREABLE_OPTIONS.filter(
    (pShareableOptionKey) =>
      Object.hasOwn(pOptions, pShareableOptionKey) &&
      pOptions?.[pShareableOptionKey] !== 0,
  )
    .filter(
      (pShareableOptionKey) =>
        pShareableOptionKey !== "doNotFollow" ||
        Object.keys(pOptions.doNotFollow).length > 0,
    )
    .filter(
      (pShareableOptionKey) =>
        pShareableOptionKey !== "exclude" ||
        Object.keys(pOptions.exclude).length > 0,
    )
    .filter(
      (pShareableOptionKey) =>
        pShareableOptionKey !== "knownViolations" ||
        pOptions.knownViolations.length > 0,
    )
    .reduce((pAll, pShareableOptionKey) => {
      pAll[pShareableOptionKey] = pOptions[pShareableOptionKey];
      return pAll;
    }, {});
}

function makeIncludeOnlyBackwardsCompatible(pOptions) {
  return pOptions.includeOnly
    ? {
        ...pOptions,
        includeOnly: pOptions?.includeOnly?.path,
      }
    : pOptions;
}

export default function summarizeOptions(pFileDirectoryArray, pOptions) {
  return {
    optionsUsed: {
      ...makeOptionsPresentable(makeIncludeOnlyBackwardsCompatible(pOptions)),
      args: pFileDirectoryArray.join(" "),
    },
  };
}
/* eslint security/detect-object-injection: 0 */
