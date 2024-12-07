import { compareRules } from "./compare.mjs";
import { uniqBy } from "#utl/array-util.mjs";

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
      .sort(compareRules),
    valid: pLeftModule.valid && pRightModule.valid,
    consolidated: pLeftModule.consolidated || pRightModule.consolidated,
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
    lModules = lModules.filter(
      // eslint-disable-next-line no-loop-func
      (pModule) => pModule.source !== lModules[0].source,
    );
  }
  return lReturnValue;
}
