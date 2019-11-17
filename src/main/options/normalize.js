const defaults = require("./defaults.json");

function uniq(pArray) {
  return Array.from(new Set(pArray));
}

function normalizeFilterOption(pFilterOption) {
  const lFilterOption = pFilterOption || {};

  if (typeof lFilterOption === "string") {
    return {
      path: lFilterOption
    };
  }
  return lFilterOption;
}

module.exports = pOptions => {
  let lRetval = {
    baseDir: process.cwd(),
    ...defaults,
    ...pOptions
  };

  lRetval.maxDepth = parseInt(lRetval.maxDepth, 10);
  lRetval.moduleSystems = uniq(lRetval.moduleSystems.sort());
  lRetval.doNotFollow = normalizeFilterOption(lRetval.doNotFollow);
  lRetval.exclude = normalizeFilterOption(lRetval.exclude);
  lRetval.exoticRequireStrings = uniq(lRetval.exoticRequireStrings.sort());

  return lRetval;
};
