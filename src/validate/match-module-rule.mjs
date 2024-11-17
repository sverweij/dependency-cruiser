import { isModuleOnlyRule, isFolderScope } from "./rule-classifiers.mjs";
import {
  matchesOrphanRule,
  matchesReachableRule,
  matchesReachesRule,
  matchesDependentsRule,
} from "./match-module-rule-helpers.mjs";

/**
 * @import { IModule } from "../../types/cruise-result.mjs";
 * @import { IAnyRuleType } from "../../types/rule-set.mjs";
 */

/**
 * @param {IModule} pModule
 * @returns {(pRule:IAnyRuleType) => boolean}
 */
function match(pModule) {
  return (pRule) =>
    matchesOrphanRule(pRule, pModule) ||
    matchesReachableRule(pRule, pModule) ||
    matchesReachesRule(pRule, pModule) ||
    matchesDependentsRule(pRule, pModule);
}

/**
 * @param {IAnyRuleType} pRule
 * @returns boolean
 */
const isInteresting = (pRule) =>
  isModuleOnlyRule(pRule) && !isFolderScope(pRule);

export default {
  match,
  isInteresting,
};
