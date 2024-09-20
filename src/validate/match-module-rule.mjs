import { isModuleOnlyRule, isFolderScope } from "./rule-classifiers.mjs";
import {
  matchesOrphanRule,
  matchesReachableRule,
  matchesReachesRule,
  matchesDependentsRule,
} from "./match-module-rule-helpers.mjs";

/**
 *
 * @param {import("../../types/cruise-result.mjs").IModule} pModule
 * @returns {(pRule:import("../../types/rule-set.mjs").IAnyRuleType) => boolean}
 */
function match(pModule) {
  return (pRule) =>
    matchesOrphanRule(pRule, pModule) ||
    matchesReachableRule(pRule, pModule) ||
    matchesReachesRule(pRule, pModule) ||
    matchesDependentsRule(pRule, pModule);
}

/**
 *
 * @param {import("../../types/rule-set.mjs").IAnyRuleType} pRule
 * @returns boolean
 */
const isInteresting = (pRule) =>
  isModuleOnlyRule(pRule) && !isFolderScope(pRule);

export default {
  match,
  isInteresting,
};
