export function getViolationStats(pViolations) {
  return pViolations.reduce(
    (pAll, pThis) => {
      pAll[pThis.rule.severity] += 1;
      return pAll;
    },
    {
      error: 0,
      warn: 0,
      info: 0,
      ignore: 0,
    }
  );
}

export function getModulesCruised(pModules) {
  return pModules.length;
}

export function getDependenciesCruised(pModules) {
  return pModules.reduce(
    (pAll, pModule) => pAll + pModule.dependencies.length,
    0
  );
}
