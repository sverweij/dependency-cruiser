import {
  matchesToPath,
  matchesModulePath,
  matchesModulePathNot,
  matchToModulePath,
} from "./matchers.mjs";
import { matchesReachesRule } from "./match-module-rule-helpers.mjs";
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
    if (pRule.to.reachable) {
      lReturnValue = !matchesReachesRule(pRule, pModule);
    }

    if (lReturnValue || !pRule.to.reachable) {
      const lGroups = extractGroups(pRule.module, pModule.source);
      const lMatchesSelf = matchToModulePath(pRule, pModule, lGroups);
      lReturnValue =
        !lMatchesSelf &&
        !pModule.dependencies.some((pDependency) =>
          matchesToPath(pRule, pDependency, lGroups),
        );
    }
  }
  return lReturnValue;
}
