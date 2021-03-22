const { isDependent } = require("../utl");

module.exports = (pModule, pGraph) => {
  if (pModule.dependencies.length > 0) {
    return false;
  }

  // when dependents already calculated take those
  if (pModule.dependents) {
    return pModule.dependents.length === 0;
  }
  // ... otherwise calculate them
  return !pGraph.some(isDependent(pModule.source));
};
