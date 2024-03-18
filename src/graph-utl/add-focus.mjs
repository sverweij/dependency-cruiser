import IndexedModuleGraph from "./indexed-module-graph.mjs";
import { moduleMatchesFilter } from "./match-facade.mjs";

function getFocusModules(pModules, pFilter) {
  return pModules.filter((pModule) => moduleMatchesFilter(pModule, pFilter));
}

function tag(pModuleNamesSet) {
  return (pModule) => ({
    ...pModule,
    matchesFocus: pModuleNamesSet.has(pModule.source),
  });
}

function scrub(pModuleNamesSet) {
  return (pModule) => ({
    ...pModule,
    dependencies: pModule.dependencies.filter(({ resolved }) =>
      pModuleNamesSet.has(resolved),
    ),
  });
}

/**
 *
 * @param {import("../../types/dependency-cruiser.js").IModule[]} pModules
 * @param {import("../../types/strict-filter-types.js").IStrictFocusType} pFilter
 * @returns
 */
export default function addFocus(pModules, pFilter) {
  if (pFilter?.path) {
    const lDepth = typeof pFilter.depth === "undefined" ? 1 : pFilter.depth;
    const lFocusedModuleNames = getFocusModules(pModules, pFilter).map(
      ({ source }) => source,
    );
    let lReachableModuleNamesArray = [];
    let lIndexedModules = new IndexedModuleGraph(pModules);

    for (let lFocusedModule of lFocusedModuleNames) {
      lReachableModuleNamesArray = lReachableModuleNamesArray
        .concat(
          lIndexedModules.findTransitiveDependents(lFocusedModule, lDepth),
        )
        .concat(
          lIndexedModules.findTransitiveDependencies(lFocusedModule, lDepth),
        );
    }

    const lFocusedModuleNamesSet = new Set(lFocusedModuleNames);
    const lReachableModuleNamesSet = new Set(lReachableModuleNamesArray);

    return pModules
      .filter(({ source }) => lReachableModuleNamesSet.has(source))
      .map(scrub(lReachableModuleNamesSet))
      .map(tag(lFocusedModuleNamesSet));
  }
  return pModules;
}
