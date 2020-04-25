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
function squashModuleToPattern(pCollapsePattern) {
  return (pModule) => {
    const lCollapseMatch = pModule.source.match(pCollapsePattern);

    return {
      ...pModule,
      source: lCollapseMatch ? lCollapseMatch[0] : pModule.source,
      consolidated: lCollapseMatch
        ? lCollapseMatch[0] !== pModule.source
        : false,
      dependencies: pModule.dependencies.map(
        squashDependencyToPattern(pCollapsePattern)
      ),
    };
  };
}

module.exports = (pModules, pCollapsePattern) =>
  consolidateModules(pModules.map(squashModuleToPattern(pCollapsePattern))).map(
    consolidateModuleDependencies
  );
