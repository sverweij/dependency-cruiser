import validate from "#validate/index.mjs";

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
 * @param  {Partial<import("../../types/cruise-result.mjs").IModule>[]} pModules array of modules
 * @param  {import("../../types/rule-set.mjs").IFlattenedRuleSet} pRuleSet normalized & validated rule set
 * @param {boolean} pValidate - whether or not to validate (typically you want to pass 'true' here)
 * @return {import("../../types/cruise-result.mjs").IModule[]} the same array of modules, with for each
 *                  of them added whether or not it is
 *                  valid and if not which rules were violated
 */
export default function addValidations(pModules, pRuleSet, pValidate) {
  return pModules.map((pModule) => ({
    ...pModule,
    ...(pValidate ? validate.module(pRuleSet, pModule) : { valid: true }),
    dependencies: pModule.dependencies.map((pDependency) =>
      addDependencyViolations(pModule, pDependency, pRuleSet, pValidate),
    ),
  }));
}
