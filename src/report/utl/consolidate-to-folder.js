const path = require("path");
const consolidateModules = require("./consolidate-modules");
const consolidateModuleDependencies = require("./consolidate-module-dependencies");

function squashDependencyToDir(pDependency) {
  return {
    ...pDependency,
    resolved: path.dirname(pDependency.resolved)
  };
}
function squashModuleToDir(pModule) {
  return {
    ...pModule,
    source: path.dirname(pModule.source),
    consolidated: true,
    dependencies: pModule.dependencies.map(squashDependencyToDir)
  };
}

module.exports = pModules =>
  consolidateModules(pModules.map(squashModuleToDir)).map(
    consolidateModuleDependencies
  );
