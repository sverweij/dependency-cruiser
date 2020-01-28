const _clone = require("lodash/clone");
const _get = require("lodash/get");
const _reject = require("lodash/reject");
const _uniqBy = require("lodash/uniqBy");

function mergeModule(pLeftModule, pRightModule) {
  return {
    ...pLeftModule,
    ...pRightModule,
    dependencies: _uniqBy(
      pLeftModule.dependencies.concat(pRightModule.dependencies),
      pDependency => pDependency.resolved
    ),
    rules: pLeftModule.rules.concat(_get(pRightModule, "rules", [])),
    valid: pLeftModule.valid && pRightModule.valid
  };
}

function mergeModules(pSourceString, pModules) {
  return pModules
    .filter(pModule => pModule.source === pSourceString)
    .reduce(
      (pAllModules, pCurrentModule) => mergeModule(pAllModules, pCurrentModule),
      {
        dependencies: [],
        rules: [],
        valid: true
      }
    );
}

module.exports = pModules => {
  let lModules = _clone(pModules);
  let lRetval = [];

  while (lModules.length > 0) {
    lRetval.push(mergeModules(lModules[0].source, lModules));
    lModules = _reject(lModules, { source: lModules[0].source });
  }
  return lRetval;
};
