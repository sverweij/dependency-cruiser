const _clone = require("lodash/clone");
// const focus = require("./add-focus");
const matchFacade = require("./match-facade");

function includeOnly(pFolders, pIncludeFilter) {
  return pIncludeFilter.path
    ? pFolders
        .filter((pFolder) =>
          matchFacade.folderMatchesFilter(pFolder, pIncludeFilter)
        )
        .map((pFolder) => ({
          ...pFolder,
          dependencies: pFolder.dependencies.filter((pDependency) =>
            matchFacade.dependencyMatchesFilter(pDependency, pIncludeFilter)
          ),
        }))
    : pFolders;
}

function exclude(pFolders, pExcludeFilter) {
  return pExcludeFilter.path
    ? pFolders
        .filter(
          (pFolder) => !matchFacade.folderMatchesFilter(pFolder, pExcludeFilter)
        )
        .map((pFolder) => ({
          ...pFolder,
          dependencies: pFolder.dependencies.filter(
            (pDependency) =>
              !matchFacade.dependencyMatchesFilter(pDependency, pExcludeFilter)
          ),
        }))
    : pFolders;
}

function applyFilters(pFolders, pFilters) {
  if (pFilters) {
    let lReturnValue = _clone(pFolders);

    if (pFilters.exclude) {
      lReturnValue = exclude(lReturnValue, pFilters.exclude);
    }
    if (pFilters.includeOnly) {
      lReturnValue = includeOnly(lReturnValue, pFilters.includeOnly);
    }
    if (pFilters.focus) {
      // lReturnValue = focus(lReturnValue, pFilters.focus);
    }
    return lReturnValue;
  }
  return pFolders;
}

module.exports = { applyFilters };
