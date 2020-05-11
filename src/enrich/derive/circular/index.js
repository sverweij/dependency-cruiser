const getCycle = require("./get-cycle");

function addCircularityCheckToDependency(pToDep, pGraph, pFrom) {
  const lCycle = getCycle(pGraph, pFrom, pToDep.resolved);
  let lReturnValue = {
    ...pToDep,
    circular: lCycle.length > 0,
  };

  if (lReturnValue.circular) {
    lReturnValue = {
      ...lReturnValue,
      cycle: lCycle,
    };
  }

  return lReturnValue;
}

/**
 * Runs through all dependencies of all pModules, for each of them determines
 * whether it's (part of a) circular (relationship) and returns the
 * dependencies with that added.
 *
 * @param  {Object} pModules [description]
 * @return {Object}               the same dependencies, but for each
 *                                of them added whether or not it is
 *                                part of
 */
module.exports = (pModules) =>
  pModules.map((pModule) => ({
    ...pModule,
    dependencies: pModule.dependencies.map((pToDep) =>
      addCircularityCheckToDependency(pToDep, pModules, pModule.source)
    ),
  }));
