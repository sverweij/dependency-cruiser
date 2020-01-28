const _get = require("lodash/get");
const moduleUtl = require("./module-utl");
const consolidateModules = require("./consolidateModules");
const consolidateModuleDependencies = require("./consolidateModuleDependencies");

function squashDependencyToPattern(pDependency, pCollapsePattern) {
  const lCollapseMatch = pDependency.resolved.match(pCollapsePattern);

  return {
    ...pDependency,
    resolved: lCollapseMatch ? lCollapseMatch[0] : pDependency.resolved
  };
}

function squashToPattern(pModules, pCollapsePattern) {
  return pModules.map(pModule => {
    const lCollapseMatch = pModule.source.match(pCollapsePattern);

    return {
      ...pModule,
      source: lCollapseMatch ? lCollapseMatch[0] : pModule.source,
      dependencies: pModule.dependencies.map(pDependency =>
        squashDependencyToPattern(pDependency, pCollapsePattern)
      )
    };
  });
}

module.exports = (pResults, pTheme, pCollapsePattern) => {
  return consolidateModules(squashToPattern(pResults.modules, pCollapsePattern))
    .map(consolidateModuleDependencies)
    .sort(moduleUtl.compareOnSource)
    .map(moduleUtl.extractRelevantTransgressions)
    .map(moduleUtl.folderify)
    .map(moduleUtl.stripSelfTransitions)
    .map(moduleUtl.applyTheme(pTheme))
    .map(moduleUtl.addURL(_get(pResults, "summary.optionsUsed.prefix", "")));
};
