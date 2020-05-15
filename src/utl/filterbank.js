const _clone = require("lodash/clone");
const focus = require("./add-focus");
const matchFacade = require("./match-facade");

function includeOnly(pModules, pIncludeFilter) {
  return pIncludeFilter.path
    ? pModules
        .filter((pModule) =>
          matchFacade.moduleMatchesFilter(pModule, pIncludeFilter)
        )
        .map((pModule) => ({
          ...pModule,
          dependencies: pModule.dependencies.filter((pDependency) =>
            matchFacade.dependencyMatchesFilter(pDependency, pIncludeFilter)
          ),
        }))
    : pModules;
}

function exclude(pModules, pExcludeFilter) {
  return pExcludeFilter.path
    ? pModules
        .filter(
          (pModule) => !matchFacade.moduleMatchesFilter(pModule, pExcludeFilter)
        )
        .map((pModule) => ({
          ...pModule,
          dependencies: pModule.dependencies.filter(
            (pDependency) =>
              !matchFacade.dependencyMatchesFilter(pDependency, pExcludeFilter)
          ),
        }))
    : pModules;
}

function applyFilters(pModules, pFilters) {
  if (pFilters) {
    let lReturnValue = _clone(pModules);

    if (pFilters.exclude) {
      lReturnValue = exclude(lReturnValue, pFilters.exclude);
    }
    if (pFilters.includeOnly) {
      lReturnValue = includeOnly(lReturnValue, pFilters.includeOnly);
    }
    if (pFilters.focus) {
      lReturnValue = focus(lReturnValue, pFilters.focus);
    }
    return lReturnValue;
  }
  return pModules;
}

module.exports = { applyFilters };
