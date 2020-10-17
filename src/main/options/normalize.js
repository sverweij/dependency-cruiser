/* eslint-disable security/detect-object-injection */
const _clone = require("lodash/clone");
const _has = require("lodash/has");
const normalizeREProperties = require("../utl/normalize-re-properties");
const defaults = require("./defaults.json");

function uniq(pArray) {
  return [...new Set(pArray)];
}

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
        lReturnValue[lFilterOptionKey]
      );
    }
  }
  return lReturnValue;
}

function normalizeCollapse(pCollapse) {
  let lReturnValue = pCollapse;
  const lOneOrMoreNonSlashes = "[^/]+";
  const FOLDER_PATTERN = `${lOneOrMoreNonSlashes}/`;
  const FOLDER_BELOW_NODE_MODULES = `node_modules/${lOneOrMoreNonSlashes}`;
  const lSingleDigitRe = /^\d$/;

  if (typeof pCollapse === "number" || pCollapse.match(lSingleDigitRe)) {
    lReturnValue = `${FOLDER_BELOW_NODE_MODULES}|^${FOLDER_PATTERN.repeat(
      Number.parseInt(pCollapse, 10)
    )}`;
  }
  return lReturnValue;
}

function normalizeCruiseOptions(pOptions) {
  let lReturnValue = {
    baseDir: process.cwd(),
    ...defaults,
    ...pOptions,
  };

  lReturnValue.maxDepth = Number.parseInt(lReturnValue.maxDepth, 10);
  lReturnValue.moduleSystems = uniq(lReturnValue.moduleSystems.sort());
  if (_has(lReturnValue, "collapse")) {
    lReturnValue.collapse = normalizeCollapse(lReturnValue.collapse);
  }
  // TODO: further down the execution path code still relies on .doNotFollow
  //       and .exclude existing. We should treat them the same as the
  //       other two filters (so either make all exist always or only
  //       when they're actually defined)
  lReturnValue.doNotFollow = normalizeFilterOption(lReturnValue.doNotFollow);
  lReturnValue.exclude = normalizeFilterOption(lReturnValue.exclude);
  lReturnValue = normalizeFilterOptions(lReturnValue, ["focus", "includeOnly"]);

  lReturnValue.exoticRequireStrings = uniq(
    lReturnValue.exoticRequireStrings.sort()
  );
  if (lReturnValue.reporterOptions) {
    lReturnValue.reporterOptions = normalizeReporterOptions(
      lReturnValue.reporterOptions
    );
  }
  return lReturnValue;
}

function normalizeFormatOptions(pFormatOptions) {
  const lFormatOptions = _clone(pFormatOptions);

  if (_has(lFormatOptions, "collapse")) {
    lFormatOptions.collapse = normalizeCollapse(lFormatOptions.collapse);
  }
  return normalizeFilterOptions(lFormatOptions, [
    "exclude",
    "focus",
    "includeOnly",
  ]);
}

module.exports = {
  normalizeCruiseOptions,
  normalizeFormatOptions,
};
