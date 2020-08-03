const matchers = require("./matchers");
const { extractGroups } = require("./utl");

/**
 * Returns true if the module violates the rule.
 * Returns false in all other cases.
 *
 * @param {import("../../types/rule-set").IRequiredRuleType} pRule
 * @param {import("../../types/cruise-result").IModule} pModule
 * @returns {boolean}
 */
module.exports = function violatesRequiredRule(pRule, pModule) {
  let lReturnValue = false;

  if (
    matchers.modulePath(pRule, pModule) &&
    matchers.modulePathNot(pRule, pModule)
  ) {
    const lGroups = extractGroups(pRule.module, pModule.source);

    lReturnValue = !pModule.dependencies.some((pDependency) =>
      matchers.toPath(pRule, pDependency, lGroups)
    );
  }
  return lReturnValue;
};
