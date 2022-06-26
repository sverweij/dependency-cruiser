const has = require("lodash/has");
const { moduleMatchesFilter } = require("./match-facade");

function getFocusModules(pModules, pFilter) {
  return pModules
    .filter((pModule) => moduleMatchesFilter(pModule, pFilter))
    .map((pModule) => ({ ...pModule, matchesFocus: true }));
}

function getCallingModules(pModules, pFocusedModuleNames) {
  return pModules
    .filter(
      (pModule) =>
        !pFocusedModuleNames.has(pModule.source) &&
        pModule.dependencies.some((pDependency) =>
          pFocusedModuleNames.has(pDependency.resolved)
        )
    )
    .map((pModule) => ({
      ...pModule,
      matchesFocus: false,
      dependencies: pModule.dependencies.filter((pDependency) =>
        pFocusedModuleNames.has(pDependency.resolved)
      ),
    }));
}

function getCalledModules(pModules, pFocusedModules, pFocusedModuleNames) {
  const lCalledModuleNames = new Set(
    pFocusedModules.reduce(
      (pAll, pModule) =>
        pAll.concat(pModule.dependencies.map(({ resolved }) => resolved)),
      []
    )
  );

  return pModules
    .filter(
      (pModule) =>
        !pFocusedModuleNames.has(pModule.source) &&
        lCalledModuleNames.has(pModule.source)
    )
    .map((pModule) => ({ ...pModule, matchesFocus: false, dependencies: [] }));
}

module.exports = function addFocus(pModules, pFilter) {
  if (has(pFilter, "path")) {
    const lFocusedModules = getFocusModules(pModules, pFilter);
    const lFocusedModuleNames = new Set(
      lFocusedModules.map(({ source }) => source)
    );

    return lFocusedModules
      .concat(getCallingModules(pModules, lFocusedModuleNames))
      .concat(getCalledModules(pModules, lFocusedModules, lFocusedModuleNames));
  }
  return pModules;
};
