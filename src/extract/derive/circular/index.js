const _get = require("lodash/get");
const getCycle = require("./getCycle");

function circularityDetectionNecessary(pOptions) {
  if (pOptions.forceCircular) {
    return true;
  }
  if (pOptions.validate) {
    return _get(pOptions, "ruleSet.forbidden", []).some(pRule =>
      pRule.to.hasOwnProperty("circular")
    );
  }
  return false;
}

function addCircularityCheckToDependency(pToDep, pGraph, pFrom) {
  const lCycle = getCycle(pGraph, pFrom, pToDep.resolved);
  let lRetval = {
    ...pToDep,
    circular: lCycle.length > 0
  };

  if (lRetval.circular) {
    lRetval = {
      ...lRetval,
      cycle: lCycle
    };
  }

  return lRetval;
}

/**
 * Runs through all dependencies, for each of them determines
 * whether it's (part of a) circular (relationship) and returns the
 * dependencies with that added.
 *
 * @param  {Object} pModules [description]
 * @return {Object}               the same dependencies, but for each
 *                                of them added whether or not it is
 *                                part of
 */
function addCircularityCheckToGraph(pModules) {
  return pModules.map(pModule => ({
    ...pModule,
    dependencies: pModule.dependencies.map(pToDep =>
      addCircularityCheckToDependency(pToDep, pModules, pModule.source)
    )
  }));
}

module.exports = (pModules, pOptions) => {
  if (circularityDetectionNecessary(pOptions)) {
    return addCircularityCheckToGraph(pModules);
  }
  return pModules;
};
