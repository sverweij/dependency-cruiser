const clone = require("lodash/clone");
const get = require("lodash/get");
const _reject = require("lodash/reject");
const uniqBy = require("lodash/uniqBy");
const compare = require("./compare");

function mergeModule(pLeftModule, pRightModule) {
  return {
    ...pLeftModule,
    ...pRightModule,
    dependencies: uniqBy(
      pLeftModule.dependencies.concat(pRightModule.dependencies),
      (pDependency) => pDependency.resolved
    ),
    rules: pLeftModule.rules
      .concat(get(pRightModule, "rules", []))
      .sort(compare.rules),
    valid: pLeftModule.valid && pRightModule.valid,
    consolidated:
      Boolean(pLeftModule.consolidated) || Boolean(pRightModule.consolidated),
  };
}

function mergeModules(pSourceString, pModules) {
  return pModules
    .filter((pModule) => pModule.source === pSourceString)
    .reduce(
      (pMergedModule, pCurrentModule) =>
        mergeModule(pMergedModule, pCurrentModule),
      {
        dependencies: [],
        rules: [],
        valid: true,
      }
    );
}

module.exports = (pModules) => {
  let lModules = clone(pModules);
  let lReturnValue = [];

  while (lModules.length > 0) {
    lReturnValue.push(mergeModules(lModules[0].source, lModules));
    lModules = _reject(lModules, { source: lModules[0].source });
  }
  return lReturnValue;
};
