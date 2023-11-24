import addFocus from "./add-focus.mjs";
import IndexedModuleGraph from "./indexed-module-graph.mjs";
import {
  moduleMatchesFilter,
  dependencyMatchesFilter,
} from "./match-facade.mjs";

function includeOnly(pModules, pIncludeFilter) {
  return pIncludeFilter.path
    ? pModules
        .filter((pModule) => moduleMatchesFilter(pModule, pIncludeFilter))
        .map((pModule) => ({
          ...pModule,
          dependencies: pModule.dependencies.filter((pDependency) =>
            dependencyMatchesFilter(pDependency, pIncludeFilter),
          ),
        }))
    : pModules;
}

function exclude(pModules, pExcludeFilter) {
  return pExcludeFilter.path
    ? pModules
        .filter((pModule) => !moduleMatchesFilter(pModule, pExcludeFilter))
        .map((pModule) => ({
          ...pModule,
          dependencies: pModule.dependencies.filter(
            (pDependency) =>
              !dependencyMatchesFilter(pDependency, pExcludeFilter),
          ),
        }))
    : pModules;
}
/**
 *
 * @param {import("../../types/cruise-result.mjs").IModule[]} pModules
 * @param {import("../../types/strict-filter-types.js").IStrictReachesType} pReachesFilter
 * @returns {import("../../types/cruise-result.mjs").IModule[]}
 */
function filterReaches(pModules, pReachesFilter) {
  const lModuleNamesToReach = pModules
    .filter((pModule) => moduleMatchesFilter(pModule, pReachesFilter))
    .map(({ source }) => source);

  /** @type {Array<string>} */
  let lReachingModules = [];
  let lIndexedModules = new IndexedModuleGraph(pModules);

  for (let lModuleToReach of lModuleNamesToReach) {
    lReachingModules = lReachingModules.concat(
      lIndexedModules.findTransitiveDependents(lModuleToReach),
    );
  }
  return pModules
    .filter(({ source }) => lReachingModules.includes(source))
    .map((pModule) => ({
      ...pModule,
      matchesReaches: lModuleNamesToReach.includes(pModule.source),
      dependencies: pModule.dependencies.filter(({ resolved }) =>
        lReachingModules.includes(resolved),
      ),
    }));
}

function tagHighlight(pModules, pHighlightFilter) {
  return pModules.map((pModule) => ({
    ...pModule,
    matchesHighlight: moduleMatchesFilter(pModule, pHighlightFilter),
  }));
}

// eslint-disable-next-line complexity
export function applyFilters(pModules, pFilters) {
  if (pFilters) {
    let lReturnValue = structuredClone(pModules);

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
