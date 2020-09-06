const consolidateModules = require("./consolidate-modules");
const consolidateModuleDependencies = require("./consolidate-module-dependencies");

function squashDependencyToPattern(pCollapsePattern) {
  return (pDependency) => {
    const lCollapseMatch = pDependency.resolved.match(pCollapsePattern);

    return {
      ...pDependency,
      resolved: lCollapseMatch ? lCollapseMatch[0] : pDependency.resolved,
    };
  };
}

function determineConsolidatedness(pConsolidated, pCollapseMatch, pSource) {
  let lReturnValue = false;

  // if it was  already established it's consolidated (e.g. from an earlier
  // consolidation step) there's no need to recalc
  if (pConsolidated === true) {
    lReturnValue = true;
  } else {
    lReturnValue = pCollapseMatch ? pCollapseMatch[0] !== pSource : false;
  }
  return lReturnValue;
}

function squashModuleToPattern(pCollapsePattern) {
  return (pModule) => {
    const lCollapseMatch = pModule.source.match(pCollapsePattern);

    return {
      ...pModule,
      source: lCollapseMatch ? lCollapseMatch[0] : pModule.source,
      consolidated: determineConsolidatedness(
        pModule.consolidated,
        lCollapseMatch,
        pModule.source
      ),
      dependencies: pModule.dependencies.map(
        squashDependencyToPattern(pCollapsePattern)
      ),
    };
  };
}

module.exports = function consolidateToPattern(pModules, pCollapsePattern) {
  return consolidateModules(
    pModules.map(squashModuleToPattern(pCollapsePattern))
  ).map(consolidateModuleDependencies);
};
