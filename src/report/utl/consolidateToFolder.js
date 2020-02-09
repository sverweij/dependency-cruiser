const path = require("path");
const consolidateModules = require("./consolidateModules");
const consolidateModuleDependencies = require("./consolidateModuleDependencies");

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
