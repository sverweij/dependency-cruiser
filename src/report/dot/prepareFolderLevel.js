const path = require("path").posix;
const _get = require("lodash/get");
const moduleUtl = require("./module-utl");
const consolidateModules = require("./consolidateModules");
const consolidateModuleDependencies = require("./consolidateModuleDependencies");

function squashDependencyToDir(pDependency) {
  return {
    ...pDependency,
    resolved: path.dirname(pDependency.resolved)
  };
}

function squashToDir(pModules) {
  return pModules.map(pModule => ({
    ...pModule,
    source: path.dirname(pModule.source),
    dependencies: pModule.dependencies.map(squashDependencyToDir)
  }));
}

module.exports = (pResults, pTheme) => {
  return consolidateModules(squashToDir(pResults.modules))
    .map(consolidateModuleDependencies)
    .sort(moduleUtl.compareOnSource)
    .map(moduleUtl.extractRelevantTransgressions)
    .map(moduleUtl.folderify)
    .map(moduleUtl.stripSelfTransitions)
    .map(moduleUtl.applyTheme(pTheme))
    .map(moduleUtl.addURL(_get(pResults, "summary.optionsUsed.prefix", "")));
};
