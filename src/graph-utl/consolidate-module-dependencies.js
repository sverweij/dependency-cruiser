const clone = require("lodash/clone");
const _reject = require("lodash/reject");
const uniq = require("lodash/uniq");
const compare = require("./compare");

function mergeDependency(pLeftDependency, pRightDependency) {
  return {
    ...pLeftDependency,
    ...pRightDependency,
    dependencyTypes: uniq(
      pLeftDependency.dependencyTypes.concat(pRightDependency.dependencyTypes)
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
      }
    );
}

function consolidateDependencies(pDependencies) {
  let lDependencies = clone(pDependencies);
  let lReturnValue = [];

  while (lDependencies.length > 0) {
    lReturnValue.push(
      mergeDependencies(lDependencies[0].resolved, lDependencies)
    );
    lDependencies = _reject(lDependencies, {
      resolved: lDependencies[0].resolved,
    });
  }

  return lReturnValue;
}

module.exports = function consolidateModuleDependencies(pModule) {
  return {
    ...pModule,
    dependencies: consolidateDependencies(pModule.dependencies),
  };
};
