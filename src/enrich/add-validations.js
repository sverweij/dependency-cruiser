const validate = require("../validate");

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
  pModules.map((pModule) => ({
    ...pModule,
    ...validate.module(pValidate, pRuleSet, pModule),
    dependencies: pModule.dependencies.map((pDependency) => ({
      ...pDependency,
      ...validate.dependency(pValidate, pRuleSet, pModule, pDependency),
    })),
  }));
