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
    "dot.filters.focus",
    "dot.filters.exclude.path",
    "ddot.collapsePattern",
    "ddot.filters.includeOnly.path",
    "ddot.filters.focus.path",
    "ddot.filters.exclude.path",
  ];

  return normalizeREProperties(pReporterOptions, lNormalizeableOptions);
}

module.exports = (pOptions) => {
  let lReturnValue = {
    baseDir: process.cwd(),
    ...defaults,
    ...pOptions,
  };

  lReturnValue.maxDepth = Number.parseInt(lReturnValue.maxDepth, 10);
  lReturnValue.moduleSystems = uniq(lReturnValue.moduleSystems.sort());
  lReturnValue.doNotFollow = normalizeFilterOption(lReturnValue.doNotFollow);
  lReturnValue.exclude = normalizeFilterOption(lReturnValue.exclude);
  if (lReturnValue.includeOnly) {
    lReturnValue.includeOnly = normalizeFilterOption(lReturnValue.includeOnly);
  }
  if (lReturnValue.focus) {
    lReturnValue.focus = normalizeFilterOption(lReturnValue.focus);
  }
  lReturnValue.exoticRequireStrings = uniq(
    lReturnValue.exoticRequireStrings.sort()
  );
  if (lReturnValue.reporterOptions) {
    lReturnValue.reporterOptions = normalizeReporterOptions(
      lReturnValue.reporterOptions
    );
  }

  return lReturnValue;
};
