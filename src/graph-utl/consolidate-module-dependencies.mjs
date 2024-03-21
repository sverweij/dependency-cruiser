import reject from "lodash/reject.js";
import compare from "./compare.mjs";
import { uniq } from "#utl/array-util.mjs";

function mergeDependency(pLeftDependency, pRightDependency) {
  return {
    ...pLeftDependency,
    ...pRightDependency,
    dependencyTypes: uniq(
      pLeftDependency.dependencyTypes.concat(pRightDependency.dependencyTypes),
    ),
    rules: pLeftDependency.rules
      .concat(pRightDependency?.rules ?? [])
      .sort(compare.rules),
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
 * @param {import('../../types/dependency-cruiser.mjs').IDependency[]} pDependencies
 * @returns {import('../../types/dependency-cruiser.mjs').IDependency[]}
 */
function consolidateDependencies(pDependencies) {
  let lDependencies = structuredClone(pDependencies);
  let lReturnValue = [];

  while (lDependencies.length > 0) {
    lReturnValue.push(
      mergeDependencies(lDependencies[0].resolved, lDependencies),
    );
    lDependencies = reject(lDependencies, {
      resolved: lDependencies[0].resolved,
    });
  }

  return lReturnValue;
}

/**
 * @param {import('../../types/dependency-cruiser.mjs').IModule} pModule
 * @returns {import('../../types/dependency-cruiser.mjs').IModule}
 */
export default function consolidateModuleDependencies(pModule) {
  return {
    ...pModule,
    dependencies: consolidateDependencies(pModule.dependencies),
  };
}
