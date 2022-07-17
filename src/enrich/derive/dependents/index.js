const getDependents = require("./get-dependents");

module.exports = function addDependents(pModules) {
  return pModules.map((pModule) => {
    return {
      ...pModule,
      dependents: getDependents(pModule, pModules),
    };
  });
};
