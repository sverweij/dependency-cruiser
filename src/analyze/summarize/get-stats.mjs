import { diffViolationArrays } from "#graph-utl/compare.mjs";
/**
 * @import { IViolation } from "../../../types/violations.mjs"
 * @import { IModule } from "../../../types/cruise-result.d.mts"
 */

/**
 * @param {IViolation[]} pViolations
 * @returns {{error:number; warn: number; info: number; ignore:number; }}
 */
export function getViolationCounts(pViolations) {
  return pViolations.reduce(
    (pAll, pThis) => {
      pAll[pThis.rule.severity] += 1;
      return pAll;
    },
    {
      error: 0,
      warn: 0,
      info: 0,
      ignore: 0,
    },
  );
}

/**
 * @param {IModule[]} pModules
 * @returns {number} number of modules cruised
 */
export function getModulesCruisedCount(pModules) {
  return pModules.length;
}

/**
 * @param {IModule[]} pModules
 * @returns {number} number of dependencies cruised
 */
export function getDependenciesCruisedCount(pModules) {
  return pModules.reduce(
    (pAll, pModule) => pAll + pModule.dependencies.length,
    0,
  );
}

/**
 * @param {IViolation[]} pKnownViolations
 * @param {IViolation[]} pCurrentViolations
 * @returns {{baselineSize:number; baselineMatched: number; baselineStale:number; }}
 */
export function getBaselineDiffCounts(pKnownViolations, pCurrentViolations) {
  const lViolationArrayDiff = diffViolationArrays(
    pKnownViolations,
    pCurrentViolations,
  );
  return {
    baselineSize: pKnownViolations.length,
    baselineMatched: lViolationArrayDiff.same.length,
    baselineStale: lViolationArrayDiff.old.length,
  };
}
