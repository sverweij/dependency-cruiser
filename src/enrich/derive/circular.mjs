/* eslint-disable security/detect-object-injection */
import IndexedModuleGraph from "#graph-utl/indexed-module-graph.mjs";

/** @import { IFlattenedRuleSet } from "../../../types/rule-set.mjs" */

function isCycleRule(pRule) {
  return (
    /* c8 ignore start */
    Object.hasOwn(pRule?.to ?? {}, "circular")
    /* c8 ignore stop */
  );
}
/**
 * @param {IFlattenedRuleSet} pRuleSet
 * @returns {boolean}
 */
export function hasCycleRule(pRuleSet) {
  return (
    (pRuleSet?.forbidden ?? []).some(isCycleRule) ||
    (pRuleSet?.allowed ?? []).some(isCycleRule)
  );
}

function addCircularityCheckToDependency(
  pIndexedGraph,
  pFrom,
  pToDep,
  pDependencyName,
) {
  let lReturnValue = {
    ...pToDep,
    circular: false,
  };
  const lCycle = pIndexedGraph.getCycle(pFrom, pToDep[pDependencyName]);

  if (lCycle.length > 0) {
    lReturnValue = {
      ...lReturnValue,
      circular: true,
      cycle: lCycle,
    };
  }

  return lReturnValue;
}

/**
 * Runs through all dependencies of all pModulesOrFolders, for each of them determines
 * whether it's (part of a) circular (relationship) and returns the
 * dependencies with that added.
 */
export default function detectAndAddCycles(
  pModulesOrFolders,
  { pSourceAttribute, pDependencyName, pSkipAnalysisNotInRules, pRuleSet },
) {
  if (!pSkipAnalysisNotInRules || hasCycleRule(pRuleSet)) {
    const lIndexedGraph = new IndexedModuleGraph(
      pModulesOrFolders,
      pSourceAttribute,
    );

    return pModulesOrFolders.map((pModuleOrFolder) => ({
      ...pModuleOrFolder,
      dependencies: pModuleOrFolder.dependencies.map((pToDep) =>
        addCircularityCheckToDependency(
          lIndexedGraph,
          pModuleOrFolder[pSourceAttribute],
          pToDep,
          pDependencyName,
        ),
      ),
    }));
  }
  return pModulesOrFolders.map((pModule) => ({
    ...pModule,
    dependencies: pModule.dependencies.map((pToDep) => ({
      ...pToDep,
      circular: false,
    })),
  }));
}
