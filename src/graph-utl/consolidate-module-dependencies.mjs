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
  let lDependencies = structuredClone(pDependencies);
  let lReturnValue = [];

  while (lDependencies.length > 0) {
    lReturnValue.push(
      mergeDependencies(lDependencies[0].resolved, lDependencies),
    );
    lDependencies = lDependencies.filter(
      // eslint-disable-next-line no-loop-func
      (pDependency) => pDependency.resolved !== lDependencies[0].resolved,
    );
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
