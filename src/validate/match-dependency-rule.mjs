// @ts-check
import { isModuleOnlyRule, isFolderScope } from "./rule-classifiers.mjs";
import {
  propertyEquals,
  propertyMatches,
  propertyMatchesNot,
  matchesFromPath,
  matchesFromPathNot,
  matchesToPath,
  matchesToPathNot,
  matchesToDependencyTypes,
  matchesToDependencyTypesNot,
  matchesToVia,
  matchesToViaOnly,
  matchesToIsMoreUnstable,
  matchesMoreThanOneDependencyType,
} from "./matchers.mjs";
import { extractGroups } from "#utl/regex-util.mjs";

/**
 * @import { IDependency, IModule } from "../../types/cruise-result.mjs";
 * @import { IAnyRuleType } from "../../types/rule-set.mjs";
 */

/**
 * @param {IModule} pFrom
 * @param {IDependency} pTo
 * @returns {(pRule) => boolean}
 */
function match(pFrom, pTo) {
  // eslint-disable-next-line complexity
  return (pRule) => {
    const lGroups = extractGroups(pRule.from, pFrom.source);

    return (
      matchesFromPath(pRule, pFrom) &&
      matchesFromPathNot(pRule, pFrom) &&
      matchesToPath(pRule, pTo, lGroups) &&
      matchesToPathNot(pRule, pTo, lGroups) &&
      matchesToDependencyTypes(pRule, pTo) &&
      matchesToDependencyTypesNot(pRule, pTo) &&
      matchesMoreThanOneDependencyType(pRule, pTo) &&
      // preCompilationOnly is not a mandatory attribute, but if the attribute
      // is in the rule but not in the dependency there won't be a match
      // anyway, so we can use the default propertyEquals method regardless
      propertyEquals(pRule, pTo, "preCompilationOnly") &&
      // couldNotResolve, circular, dynamic and exoticallyRequired _are_ mandatory
      propertyEquals(pRule, pTo, "couldNotResolve") &&
      propertyEquals(pRule, pTo, "circular") &&
      propertyEquals(pRule, pTo, "dynamic") &&
      propertyEquals(pRule, pTo, "exoticallyRequired") &&
      propertyMatches(pRule, pTo, "license", "license") &&
      propertyMatchesNot(pRule, pTo, "licenseNot", "license") &&
      propertyMatches(pRule, pTo, "exoticRequire", "exoticRequire") &&
      propertyMatchesNot(pRule, pTo, "exoticRequireNot", "exoticRequire") &&
      matchesToVia(pRule, pTo, lGroups) &&
      matchesToViaOnly(pRule, pTo, lGroups) &&
      matchesToIsMoreUnstable(pRule, pFrom, pTo)
    );
  };
}

/**
 * @param {IAnyRuleType} pRule
 * @returns boolean
 */
const isInteresting = (pRule) =>
  !isModuleOnlyRule(pRule) && !isFolderScope(pRule);

export default {
  match,
  isInteresting,
};
