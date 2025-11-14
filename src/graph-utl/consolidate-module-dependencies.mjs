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
  return pDependencies
    .filter((pDependency) => pDependency.resolved === pResolvedName)
    .reduce(
      (pAllDependencies, pCurrentDependency) =>
        mergeDependency(pAllDependencies, pCurrentDependency),
      {
        dependencyTypes: [],
        rules: [],
        valid: true,
      },
    );
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
