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
  let lReturnValue = {
    dependencies: [],
    rules: [],
    valid: true,
  };

  for (const lModule of pModules) {
    if (lModule.source === pSourceString) {
      lReturnValue = mergeModule(lReturnValue, lModule);
    }
  }
  return lReturnValue;
}

export default function consolidateModules(pModules) {
  const lProcessed = new Set();
  const lReturnValue = [];

  for (const lModule of pModules) {
    if (!lProcessed.has(lModule.source)) {
      lReturnValue.push(mergeModules(lModule.source, pModules));
      lProcessed.add(lModule.source);
    }
  }
  return lReturnValue;
}
