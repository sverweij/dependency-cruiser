const path = require("path").posix;
const _get = require("lodash/get");
const moduleUtl = require("./module-utl");
const consolidateModules = require("./consolidateModules");
const consolidateModuleDependencies = require("./consolidateModuleDependencies");

function shortendep(pDep) {
  return {
    ...pDep,
    resolved: path.dirname(pDep.resolved)
  };
}

function squashToDir(pModules) {
  return pModules.map(pModule => ({
    ...pModule,
    source: path.dirname(pModule.source),
    dependencies: pModule.dependencies.map(shortendep)
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
