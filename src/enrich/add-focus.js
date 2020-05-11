const _get = require("lodash/get");
const filenameMatchesPattern = require("../utl/filename-matches-pattern");

function getFocusModules(pModules, pPattern) {
  return pModules
    .filter((pModule) => filenameMatchesPattern(pModule.source, pPattern))
    .map((pModule) => ({ ...pModule, matchesFocus: true }));
}

function getCallingModules(pModules, pPattern) {
  return pModules
    .filter(
      (pModule) =>
        !filenameMatchesPattern(pModule.source, pPattern) &&
        pModule.dependencies.some(({ resolved }) =>
          filenameMatchesPattern(resolved, pPattern)
        )
    )
    .map((pModule) => ({
      ...pModule,
      matchesFocus: false,
      dependencies: pModule.dependencies.filter(({ resolved }) =>
        filenameMatchesPattern(resolved, pPattern)
      ),
    }));
}

function getCalledModules(pModules, pPattern, pFocusModules) {
  const lCalledModuleNames = new Set(
    pFocusModules.reduce(
      (pAll, pModule) =>
        pAll.concat(pModule.dependencies.map(({ resolved }) => resolved)),
      []
    )
  );

  return pModules
    .filter(
      ({ source }) =>
        !filenameMatchesPattern(source, pPattern) &&
        lCalledModuleNames.has(source)
    )
    .map((pModule) => ({ ...pModule, matchesFocus: false, dependencies: [] }));
}

module.exports = function addFocus(pModules, pFilter) {
  const lPattern = _get(pFilter, "path");
  if (lPattern) {
    const lFocusModules = getFocusModules(pModules, lPattern);

    return lFocusModules
      .concat(getCallingModules(pModules, lPattern))
      .concat(getCalledModules(pModules, lPattern, lFocusModules));
  }
  return pModules;
};
