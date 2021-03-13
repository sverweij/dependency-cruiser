const getDependents = require("./get-dependents");

function shouldAddDependents(pOptions) {
  return Boolean(pOptions.forceDeriveDependents);
}

module.exports = function addDependents(pModules, pOptions) {
  if (shouldAddDependents(pOptions)) {
    return pModules.map((pModule) => {
      return {
        ...pModule,
        dependents: getDependents(pModule, pModules),
        // TODO: observation:
        // an orphan is a module for which module.dependents === 0 && module.dependencies === 0
        // orphan: lDependents.length + pModule.dependencies.length === 0,
      };
    });
  }
  return pModules;
};
