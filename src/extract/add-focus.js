const filenameMatchesPattern = require("./utl/filename-matches-pattern");

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

module.exports = function addFocus(pModules, pPattern) {
  if (pPattern) {
    const lFocusModules = getFocusModules(pModules, pPattern);

    return lFocusModules
      .concat(getCallingModules(pModules, pPattern))
      .concat(getCalledModules(pModules, pPattern, lFocusModules));
  }
  return pModules;
};
