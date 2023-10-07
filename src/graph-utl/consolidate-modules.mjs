import _reject from "lodash/reject.js";
import uniqBy from "lodash/uniqBy.js";
import compare from "./compare.mjs";

function mergeModule(pLeftModule, pRightModule) {
  return {
    ...pLeftModule,
    ...pRightModule,
    dependencies: uniqBy(
      pLeftModule.dependencies.concat(pRightModule.dependencies),
      (pDependency) => pDependency.resolved,
    ),
    rules: pLeftModule.rules
      .concat(pRightModule?.rules ?? [])
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
      },
    );
}

export default function consolidateModules(pModules) {
  let lModules = structuredClone(pModules);
  let lReturnValue = [];

  while (lModules.length > 0) {
    lReturnValue.push(mergeModules(lModules[0].source, lModules));
    lModules = _reject(lModules, { source: lModules[0].source });
  }
  return lReturnValue;
}
