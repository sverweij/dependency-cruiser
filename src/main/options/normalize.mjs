/* eslint-disable security/detect-object-injection */
import { normalizeREProperties } from "../helpers.mjs";
import defaults from "./defaults.mjs";
import { uniq } from "#utl/array-util.mjs";

const DEFAULT_CACHE_FOLDER = "node_modules/.cache/dependency-cruiser";
const DEFAULT_CACHE_STRATEGY = "metadata";

function normalizeFilterOption(pFilterOption) {
  let lReturnValue = pFilterOption || {};

  if (typeof lReturnValue === "string" || Array.isArray(lReturnValue)) {
    lReturnValue = {
      path: lReturnValue,
    };
  }
  return normalizeREProperties(lReturnValue, ["path"]);
}

function normalizeReporterOptions(pReporterOptions) {
  const lNormalizeableOptions = [
    "archi.collapsePattern",
    "archi.filters.includeOnly.path",
    "archi.filters.focus.path",
    "archi.filters.exclude.path",
    "dot.collapsePattern",
    "dot.filters.includeOnly.path",
    "dot.filters.focus.path",
    "dot.filters.exclude.path",
    "ddot.collapsePattern",
    "ddot.filters.includeOnly.path",
    "ddot.filters.focus.path",
    "ddot.filters.exclude.path",
  ];

  return normalizeREProperties(pReporterOptions, lNormalizeableOptions);
}

function normalizeFilterOptions(pOptions, pFilterOptionKeys) {
  let lReturnValue = { ...pOptions };

  for (let lFilterOptionKey of pFilterOptionKeys) {
    if (pOptions[lFilterOptionKey]) {
      lReturnValue[lFilterOptionKey] = normalizeFilterOption(
        lReturnValue[lFilterOptionKey],
      );
    }
  }
  return lReturnValue;
}

function normalizeCollapse(pCollapse) {
  let lReturnValue = pCollapse;
  const lOneOrMoreNonSlashes = "[^/]+";
  const lFolderPattern = `${lOneOrMoreNonSlashes}/`;
  const lFolderBelowNodeModules = `node_modules/${lOneOrMoreNonSlashes}`;
  const lSingleDigitRe = /^\d$/;

  if (typeof pCollapse === "number" || pCollapse.match(lSingleDigitRe)) {
    lReturnValue = `${lFolderBelowNodeModules}|^${lFolderPattern.repeat(
      Number.parseInt(pCollapse, 10),
    )}`;
  }
  return lReturnValue;
}

function normalizeFocusDepth(pFormatOptions) {
  /** @type  {import("../../../types/dependency-cruiser.js").IFormatOptions}*/
  let lFormatOptions = structuredClone(pFormatOptions);
  if (Object.hasOwn(lFormatOptions, "focusDepth")) {
    if (lFormatOptions?.focus) {
      lFormatOptions.focus.depth = Number.parseInt(
        lFormatOptions.focusDepth,
        10,
      );
    }
    delete lFormatOptions.focusDepth;
  }
  return lFormatOptions;
}

/**
 *
 * @param {import("../../../types/dependency-cruiser.js").IForbiddenRuleType} pRule
 * @returns {boolean}
 */
function hasMetricsRule(pRule) {
  // TODO: philosophy: is a rule with 'folder' in it a metrics rule?
  //       Or is it a misuse to ensure folder derivations (like cycles) get
  //       kicked off?
  return (
    Object.hasOwn(pRule?.to ?? {}, "moreUnstable") ||
    (pRule?.scope ?? "module") === "folder"
  );
}

/**
 *
 * @param {import("../../../types/dependency-cruiser.js").IFlattenedRuleSet} pRuleSet
 * @returns {boolean}
 */
function ruleSetHasMetricsRule(pRuleSet) {
  const lRuleSet = pRuleSet || {};
  return (
    (lRuleSet.forbidden || []).some(hasMetricsRule) ||
    (lRuleSet.allowed || []).some(hasMetricsRule)
  );
}

/**
 *
 * @param {import('../../../types/dependency-cruiser.js').ICruiseOptions} pOptions
 * @returns Boolean
 */
function reporterShowsMetrics(pOptions) {
  return (
    (pOptions.reporterOptions?.[pOptions?.outputType]?.showMetrics ?? false) ===
    true
  );
}

/**
 * Determines whether (instability) metrics should be calculated
 *
 * @param {import('../../../types/dependency-cruiser.js').ICruiseOptions} pOptions
 * @returns Boolean
 */
function shouldCalculateMetrics(pOptions) {
  return (
    pOptions.metrics ||
    pOptions.outputType === "metrics" ||
    reporterShowsMetrics(pOptions) ||
    ruleSetHasMetricsRule(pOptions.ruleSet)
  );
}

/**
 * @param {string|boolean|Partial<import("../../../types/cache-options.js").ICacheOptions>} pCacheOptions
 * @returns {import("../../../types/cache-options.js").ICacheOptions}
 */
function normalizeCacheOptions(pCacheOptions) {
  let lNormalizedCacheOptions = pCacheOptions;

  if (typeof pCacheOptions === "string") {
    lNormalizedCacheOptions = {
      folder: pCacheOptions,
    };
  }

  if (pCacheOptions === true) {
    lNormalizedCacheOptions = {};
  }

  // TODO: put these values in a central spot as constants
  //      (folder is already in src/cli/defaults.js but depending on the UI (cli)
  //       is not OK. We might b.t.w. wanna deduplicate the defaulting)
  return {
    folder: DEFAULT_CACHE_FOLDER,
    strategy: DEFAULT_CACHE_STRATEGY,
    ...lNormalizedCacheOptions,
  };
}

/**
 *
 * @param {import('../../../types/options.mjs').ICruiseOptions} pOptions
 * @param {string[]} pFileAndDirectoryArray
 * @returns {import('../../../types/strict-options.js').IStrictCruiseOptions}
 */
export function normalizeCruiseOptions(pOptions, pFileAndDirectoryArray = []) {
  /** @type {import('../../../types/strict-options.js').IStrictCruiseOptions} */
  let lReturnValue = {
    baseDir: process.cwd(),
    ...defaults,
    ...pOptions,
    args: pFileAndDirectoryArray.join(" "),
  };

  // @ts-expect-error the idea of normalizing maxDepth to number is that after
  // that we're sure it's a number. Should maybe best be solved by
  // having two types/ interfaces
  lReturnValue.maxDepth = Number.parseInt(lReturnValue.maxDepth, 10);
  lReturnValue.moduleSystems = uniq(lReturnValue.moduleSystems);
  if (Object.hasOwn(lReturnValue, "collapse")) {
    lReturnValue.collapse = normalizeCollapse(lReturnValue.collapse);
  }
  // TODO: further down the execution path code still relies on .doNotFollow
  //       and .exclude existing. We should treat them the same as the
  //       other filters (so either make all exist always or only
  //       when they're actually defined)
  lReturnValue.doNotFollow = normalizeFilterOption(lReturnValue.doNotFollow);
  lReturnValue.exclude = normalizeFilterOption(lReturnValue.exclude);
  lReturnValue.extraExtensionsToScan = lReturnValue.extraExtensionsToScan || [];
  lReturnValue = normalizeFilterOptions(lReturnValue, [
    "focus",
    "includeOnly",
    "reaches",
    "highlight",
  ]);

  lReturnValue.exoticRequireStrings = uniq(lReturnValue.exoticRequireStrings);
  if (lReturnValue.reporterOptions) {
    lReturnValue.reporterOptions = normalizeReporterOptions(
      lReturnValue.reporterOptions,
    );
  }
  lReturnValue.metrics = shouldCalculateMetrics(pOptions);
  // if (has(pOptions, "ruleSet")) {
  //   lReturnValue.ruleSet = normalizeRuleSet(pOptions.ruleSet);
  // }
  if (lReturnValue.cache) {
    lReturnValue.cache = normalizeCacheOptions(lReturnValue.cache);
  }

  return normalizeFocusDepth(lReturnValue);
}

/**
 *
 * @param {import("../../../types/dependency-cruiser.js").IFormatOptions} pFormatOptions
 * @returns {import("../../../types/strict-options.js").IStrictFormatOptions}
 */
export function normalizeFormatOptions(pFormatOptions) {
  let lFormatOptions = structuredClone(pFormatOptions);

  if (Object.hasOwn(lFormatOptions, "collapse")) {
    lFormatOptions.collapse = normalizeCollapse(lFormatOptions.collapse);
  }

  lFormatOptions = normalizeFilterOptions(lFormatOptions, [
    "exclude",
    "focus",
    "highlight",
    "includeOnly",
    "reaches",
  ]);

  return normalizeFocusDepth(lFormatOptions);
}
