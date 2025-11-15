import { compareRules } from "./compare.mjs";
import { uniq } from "#utl/array-util.mjs";

/**
 * @import { IDependency, IModule } from "../../types/cruise-result.mjs";
 */

function mergeDependency(pLeftDependency, pRightDependency) {
  return {
    ...pLeftDependency,
    ...pRightDependency,
    dependencyTypes: uniq(
      pLeftDependency.dependencyTypes.concat(pRightDependency.dependencyTypes),
    ),
    rules: pLeftDependency.rules
      .concat(pRightDependency?.rules ?? [])
      .sort(compareRules),
    valid: pLeftDependency.valid && pRightDependency.valid,
  };
}

function mergeDependencies(pResolvedName, pDependencies) {
  let lReturnValue = {
    dependencyTypes: [],
    rules: [],
    valid: true,
  };
  for (const lDependency of pDependencies) {
    if (lDependency.resolved === pResolvedName) {
      lReturnValue = mergeDependency(lReturnValue, lDependency);
    }
  }
  return lReturnValue;
}

/**
 * @param {IDependency[]} pDependencies
 * @returns {IDependency[]}
 */
function consolidateDependencies(pDependencies) {
  const lProcessed = new Set();
  const lReturnValue = [];

  for (const lDependency of pDependencies) {
    if (!lProcessed.has(lDependency.resolved)) {
      lReturnValue.push(mergeDependencies(lDependency.resolved, pDependencies));
      lProcessed.add(lDependency.resolved);
    }
  }

  return lReturnValue;
}

/**
 * @param {IModule} pModule
 * @returns {IModule}
 */
export default function consolidateModuleDependencies(pModule) {
  return {
    ...pModule,
    dependencies: consolidateDependencies(pModule.dependencies),
  };
}
