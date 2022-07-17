const get = require("lodash/get");
const getDependents = require("./get-dependents");

function hasDependentsRule(pOptions) {
  // TODO: might want to enable this in required and allowed rules as well
  return get(pOptions, "ruleSet.forbidden", []).some(
    (pRule) =>
      get(pRule, "module.numberOfDependentsLessThan") ||
      get(pRule, "module.numberOfDependentsMoreThan")
  );
}

/**
 *
 * @param {import("../../../../types/cruise-result").IOptions} pOptions
 * @returns
 */
function shouldAddDependents(pOptions) {
  return (
    Boolean(pOptions.forceDeriveDependents) ||
    Boolean(pOptions.metrics) ||
    Boolean(pOptions.reaches) ||
    pOptions.outputType === "metrics" ||
    hasDependentsRule(pOptions)
  );
}

module.exports = function addDependents(pModules, pOptions) {
  if (shouldAddDependents(pOptions)) {
    return pModules.map((pModule) => {
      return {
        ...pModule,
        dependents: getDependents(pModule, pModules),
      };
    });
  }
  return pModules;
};
