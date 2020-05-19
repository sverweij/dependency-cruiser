const _get = require("lodash/get");
const matchFacade = require("./match-facade");

function getFocusModules(pModules, pFilter) {
  return pModules
    .filter((pModule) => matchFacade.moduleMatchesFilter(pModule, pFilter))
    .map((pModule) => ({ ...pModule, matchesFocus: true }));
}

function getCallingModules(pModules, pFilter) {
  return pModules
    .filter(
      (pModule) =>
        !matchFacade.moduleMatchesFilter(pModule, pFilter) &&
        pModule.dependencies.some((pDependency) =>
          matchFacade.dependencyMatchesFilter(pDependency, pFilter)
        )
    )
    .map((pModule) => ({
      ...pModule,
      matchesFocus: false,
      dependencies: pModule.dependencies.filter((pDependency) =>
        matchFacade.dependencyMatchesFilter(pDependency, pFilter)
      ),
    }));
}

function getCalledModules(pModules, pFilter, pFocusModules) {
  const lCalledModuleNames = new Set(
    pFocusModules.reduce(
      (pAll, pModule) =>
        pAll.concat(pModule.dependencies.map(({ resolved }) => resolved)),
      []
    )
  );

  return pModules
    .filter(
      (pModule) =>
        !matchFacade.moduleMatchesFilter(pModule, pFilter) &&
        lCalledModuleNames.has(pModule.source)
    )
    .map((pModule) => ({ ...pModule, matchesFocus: false, dependencies: [] }));
}

module.exports = function addFocus(pModules, pFilter) {
  if (_get(pFilter, "path")) {
    const lFocusModules = getFocusModules(pModules, pFilter);

    return lFocusModules
      .concat(getCallingModules(pModules, pFilter))
      .concat(getCalledModules(pModules, pFilter, lFocusModules));
  }
  return pModules;
};
