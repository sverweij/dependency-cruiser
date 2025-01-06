/* eslint-disable security/detect-object-injection */

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
 * Runs through all dependencies of all pNodes, for each of them determines
 * whether it's (part of a) circular (relationship) and returns the
 * dependencies with that added.
 */
export default function detectAndAddCycles(
  pNodes,
  pIndexedNodes,
  { pSourceAttribute, pDependencyName, pSkipAnalysisNotInRules, pRuleSet },
) {
  if (!pSkipAnalysisNotInRules || hasCycleRule(pRuleSet)) {
    return pNodes.map((pModule) => ({
      ...pModule,
      dependencies: pModule.dependencies.map((pToDep) =>
        addCircularityCheckToDependency(
          pIndexedNodes,
          pModule[pSourceAttribute],
          pToDep,
          pDependencyName,
        ),
      ),
    }));
  }
  return pNodes.map((pModule) => ({
    ...pModule,
    dependencies: pModule.dependencies.map((pToDep) => ({
      ...pToDep,
      circular: false,
    })),
  }));
}
