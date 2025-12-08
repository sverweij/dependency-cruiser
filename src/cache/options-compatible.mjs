// @ts-check
import { isDeepStrictEqual } from "node:util";

/**
 * @import { IStrictCruiseOptions } from "../../types/strict-options.mjs"
 */

export function includeOnlyIsCompatible(pExistingFilter, pNewFilter) {
  return (
    !pExistingFilter || isDeepStrictEqual({ path: pExistingFilter }, pNewFilter)
  );
}

export function filterOptionIsCompatible(pExistingOption, pNewOption) {
  return !pExistingOption || isDeepStrictEqual(pExistingOption, pNewOption);
}

export function optionIsCompatible(pExistingOption, pNewOption) {
  return isDeepStrictEqual(pExistingOption, pNewOption);
}

export function limitIsCompatible(pExistingLimit, pNewLimit) {
  return !pExistingLimit || pExistingLimit >= (pNewLimit || pExistingLimit + 1);
}

export function metricsIsCompatible(pExistingMetrics, pNewMetrics) {
  return pExistingMetrics || pExistingMetrics === pNewMetrics;
}

export function cacheOptionIsCompatible(pExistingCacheOption, pNewCacheOption) {
  if (!pExistingCacheOption || !pNewCacheOption) {
    return false;
  }
  return (
    pExistingCacheOption === pNewCacheOption ||
    isDeepStrictEqual(pExistingCacheOption, pNewCacheOption)
  );
}

/**
 *
 * @param {IStrictCruiseOptions} pOldOptions
 * @param {IStrictCruiseOptions} pNewOptions
 * @returns {boolean}
 */
// eslint-disable-next-line complexity
export function optionsAreCompatible(pOldOptions, pNewOptions) {
  return (
    pOldOptions.args === pNewOptions.args &&
    pOldOptions.rulesFile === pNewOptions.rulesFile &&
    pOldOptions.tsPreCompilationDeps === pNewOptions.tsPreCompilationDeps &&
    pOldOptions.preserveSymlinks === pNewOptions.preserveSymlinks &&
    pOldOptions.combinedDependencies === pNewOptions.combinedDependencies &&
    pOldOptions.experimentalStats === pNewOptions.experimentalStats &&
    pOldOptions.detectJSDocImports === pNewOptions.detectJSDocImports &&
    pOldOptions.detectProcessBuiltinModuleCalls ===
      pNewOptions.detectProcessBuiltinModuleCalls &&
    pOldOptions.skipAnalysisNotInRules === pNewOptions.skipAnalysisNotInRules &&
    metricsIsCompatible(pOldOptions.metrics, pNewOptions.metrics) &&
    // includeOnly suffers from a backwards compatibility disease
    includeOnlyIsCompatible(pOldOptions.includeOnly, pNewOptions.includeOnly) &&
    filterOptionIsCompatible(
      pOldOptions.doNotFollow,
      pNewOptions.doNotFollow,
    ) &&
    filterOptionIsCompatible(
      pOldOptions.moduleSystems,
      pNewOptions.moduleSystems,
    ) &&
    filterOptionIsCompatible(pOldOptions.exclude, pNewOptions.exclude) &&
    filterOptionIsCompatible(pOldOptions.focus, pNewOptions.focus) &&
    filterOptionIsCompatible(pOldOptions.reaches, pNewOptions.reaches) &&
    filterOptionIsCompatible(pOldOptions.highlight, pNewOptions.highlight) &&
    filterOptionIsCompatible(pOldOptions.collapse, pNewOptions.collapse) &&
    limitIsCompatible(pOldOptions.maxDepth, pNewOptions.maxDepth) &&
    optionIsCompatible(
      pOldOptions.knownViolations || [],
      pNewOptions.knownViolations || [],
    ) &&
    optionIsCompatible(
      pOldOptions.enhancedResolveOptions,
      pNewOptions.enhancedResolveOptions,
    ) &&
    optionIsCompatible(
      pOldOptions.exoticRequireStrings,
      pNewOptions.exoticRequireStrings,
    ) &&
    cacheOptionIsCompatible(pOldOptions.cache, pNewOptions.cache)
  );
}
