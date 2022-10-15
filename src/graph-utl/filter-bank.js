const clone = require("lodash/clone");
const addFocus = require("./add-focus");
const IndexedModuleGraph = require("./indexed-module-graph");
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
/**
 *
 * @param {import("../../types/cruise-result").IModule[]} pModules
 * @param {import("../../types/strict-filter-types").IStrictReachesType} pReachesFilter
 * @returns {import("../../types/cruise-result").IModule[]}
 */
function filterReaches(pModules, pReachesFilter) {
  const lModuleNamesToReach = pModules
    .filter((pModule) =>
      matchFacade.moduleMatchesFilter(pModule, pReachesFilter)
    )
    .map(({ source }) => source);

  /** @type {Array<string>} */
  let lReachingModules = [];
  let lIndexedModules = new IndexedModuleGraph(pModules);

  for (let lModuleToReach of lModuleNamesToReach) {
    lReachingModules = lReachingModules.concat(
      lIndexedModules.findTransitiveDependents(lModuleToReach)
    );
  }
  return pModules
    .filter(({ source }) => lReachingModules.includes(source))
    .map((pModule) => ({
      ...pModule,
      matchesReaches: lModuleNamesToReach.includes(pModule.source),
      dependencies: pModule.dependencies.filter(({ resolved }) =>
        lReachingModules.includes(resolved)
      ),
    }));
}

function tagHighlight(pModules, pHighlightFilter) {
  return pModules.map((pModule) => ({
    ...pModule,
    matchesHighlight: matchFacade.moduleMatchesFilter(
      pModule,
      pHighlightFilter
    ),
  }));
}

// eslint-disable-next-line complexity
function applyFilters(pModules, pFilters) {
  if (pFilters) {
    let lReturnValue = clone(pModules);

    if (pFilters.exclude) {
      lReturnValue = exclude(lReturnValue, pFilters.exclude);
    }
    if (pFilters.includeOnly) {
      lReturnValue = includeOnly(lReturnValue, pFilters.includeOnly);
    }
    if (pFilters.focus) {
      lReturnValue = addFocus(lReturnValue, pFilters.focus);
    }
    if (pFilters.reaches) {
      lReturnValue = filterReaches(lReturnValue, pFilters.reaches);
    }
    if (pFilters.highlight) {
      lReturnValue = tagHighlight(lReturnValue, pFilters.highlight);
    }
    return lReturnValue;
  }
  return pModules;
}

module.exports = { applyFilters };
