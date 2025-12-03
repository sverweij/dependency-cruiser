import addFocus from "./add-focus.mjs";
import IndexedModuleGraph from "./indexed-module-graph.mjs";
import {
  moduleMatchesFilter,
  dependencyMatchesFilter,
} from "./match-facade.mjs";

/**
 * @import { IModule } from "../../types/cruise-result.mjs";
 * @import { IStrictReachesType } from "../../types/strict-filter-types.mjs";
 */

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
 * @param {IModule[]} pModules
 * @param {IStrictReachesType} pReachesFilter
 * @returns {IModule[]}
 */
function filterReaches(pModules, pReachesFilter) {
  // TODO: optimize - avoid re-indexing for each reaches filter
  /** @type {Set<string>} */
  const lModuleNamesToReach = new Set();
  for (const lModule of pModules) {
    if (moduleMatchesFilter(lModule, pReachesFilter)) {
      lModuleNamesToReach.add(lModule.source);
    }
  }

  /** @type {Set<string>} */
  const lReachingModules = new Set();
  const lIndexedModules = new IndexedModuleGraph(pModules);

  for (const lModuleToReach of lModuleNamesToReach) {
    for (const lDependent of lIndexedModules.findTransitiveDependents(
      lModuleToReach,
    )) {
      lReachingModules.add(lDependent);
    }
  }

  return pModules
    .filter(({ source }) => lReachingModules.has(source))
    .map((pModule) => ({
      ...pModule,
      matchesReaches: lModuleNamesToReach.has(pModule.source),
      dependencies: pModule.dependencies.filter(({ resolved }) =>
        lReachingModules.has(resolved),
      ),
    }));
}

function tagHighlight(pModules, pHighlightFilter) {
  return pModules.map((pModule) => ({
    ...pModule,
    matchesHighlight: moduleMatchesFilter(pModule, pHighlightFilter),
  }));
}

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
