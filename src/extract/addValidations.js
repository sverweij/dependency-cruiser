const validate = require("../validate");

function addDependencyValidation(pDependency, pValidate, pRuleSet, pModule) {
  return {
    ...pDependency,
    ...validate.dependency(pValidate, pRuleSet, pModule, pDependency)
  };
}

function addModuleValidation(pModule, pValidate, pRuleSet) {
  return {
    ...pModule,
    ...validate.module(pValidate, pRuleSet, pModule)
  };
}

/**
 * Runs through all dependencies, validates them
 * - when there's a transgression: adds it
 * - when everything is hunky-dory: adds the dependency is valid
 *
 * @param  {Object} pModules [description]
 * @param  {Object} pValidate [description]
 * @param  {Object} pRuleSet [description]
 * @return {Object}               the same dependencies, but for each
 *                                of them added whether or not it is
 *                                part of
 */
module.exports = (pModules, pValidate, pRuleSet) =>
  pModules.map(pModule => ({
    ...addModuleValidation(pModule, pValidate, pRuleSet),
    dependencies: pModule.dependencies.map(pDependency =>
      addDependencyValidation(pDependency, pValidate, pRuleSet, pModule)
    )
  }));
