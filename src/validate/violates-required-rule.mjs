import matchers from "./matchers.mjs";
import { extractGroups } from "#utl/regex-util.mjs";

/**
 * Returns true if the module violates the rule.
 * Returns false in all other cases.
 *
 * @param {import("../../types/rule-set.mjs").IRequiredRuleType} pRule
 * @param {import("../../types/cruise-result.mjs").IModule} pModule
 * @returns {boolean}
 */
export default function violatesRequiredRule(pRule, pModule) {
  let lReturnValue = false;

  if (
    matchers.modulePath(pRule, pModule) &&
    matchers.modulePathNot(pRule, pModule)
  ) {
    const lGroups = extractGroups(pRule.module, pModule.source);

    lReturnValue = !pModule.dependencies.some((pDependency) =>
      matchers.toPath(pRule, pDependency, lGroups),
    );
  }
  return lReturnValue;
}
