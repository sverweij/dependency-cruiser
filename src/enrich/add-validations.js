const validate = require("../validate");

function addDependencyViolations(pModule, pDependency, pRuleSet, pValidate) {
  return {
    ...pDependency,
    ...(pValidate
      ? validate.dependency(pRuleSet, pModule, pDependency)
      : { valid: true }),
  };
}
/**
 * Runs through all dependencies, validates them
 * - when there's a transgression: adds it
 * - when everything is hunky-dory: adds the dependency is valid
 *
 * @param  {Object} pModules [description]
 * @param  {Object} pRuleSet [description]
 * @return {Object}               the same dependencies, but for each
 *                                of them added whether or not it is
 *                                part of
 */
module.exports = (pModules, pRuleSet, pValidate) =>
  pModules.map((pModule) => ({
    ...pModule,
    ...(pValidate ? validate.module(pRuleSet, pModule) : { valid: true }),
    dependencies: pModule.dependencies.map((pDependency) =>
      addDependencyViolations(pModule, pDependency, pRuleSet, pValidate)
    ),
  }));
