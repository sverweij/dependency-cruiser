const path = require("path");
const consolidateModules = require("./consolidate-modules");
const consolidateModuleDependencies = require("./consolidate-module-dependencies");

function squashDependencyToDirectory(pDependency) {
  return {
    ...pDependency,
    resolved: path.dirname(pDependency.resolved),
  };
}
function squashModuleToDirectory(pModule) {
  return {
    ...pModule,
    source: path.dirname(pModule.source),
    consolidated: true,
    dependencies: pModule.dependencies.map(squashDependencyToDirectory),
  };
}

module.exports = (pModules) =>
  consolidateModules(pModules.map(squashModuleToDirectory)).map(
    consolidateModuleDependencies
  );
