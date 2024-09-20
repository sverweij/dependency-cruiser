import {
  matchesToPath,
  matchesModulePath,
  matchesModulePathNot,
} from "./matchers.mjs";
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
    matchesModulePath(pRule, pModule) &&
    matchesModulePathNot(pRule, pModule)
  ) {
    const lGroups = extractGroups(pRule.module, pModule.source);

    lReturnValue = !pModule.dependencies.some((pDependency) =>
      matchesToPath(pRule, pDependency, lGroups),
    );
  }
  return lReturnValue;
}
