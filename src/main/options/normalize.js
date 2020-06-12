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

  return lReturnValue;
};
