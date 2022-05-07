const { extractGroups } = require("../utl/regex-util");
const { isModuleOnlyRule, isFolderScope } = require("./rule-classifiers");
const matchers = require("./matchers");

/**
 *
 * @param {import("../../types/dependency-cruiser").IModule} pFrom
 * @param {import("../../types/dependency-cruiser").IDependency} pTo
 * @returns {(pRule) => boolean}
 */
function match(pFrom, pTo) {
  // eslint-disable-next-line complexity
  return (pRule) => {
    const lGroups = extractGroups(pRule.from, pFrom.source);

    return (
      matchers.fromPath(pRule, pFrom) &&
      matchers.fromPathNot(pRule, pFrom) &&
      matchers.toPath(pRule, pTo, lGroups) &&
      matchers.toPathNot(pRule, pTo, lGroups) &&
      matchers.toDependencyTypes(pRule, pTo) &&
      matchers.toDependencyTypesNot(pRule, pTo) &&
      matchers.matchesMoreThanOneDependencyType(pRule, pTo) &&
      // preCompilationOnly is not a mandatory attribute, but if the attribute
      // is in the rule but not in the dependency there won't be a match
      // anyway, so we can use the default propertyEquals method regardless
      matchers.propertyEquals(pRule, pTo, "preCompilationOnly") &&
      // couldNotResolve, circular, dynamic and exoticallyRequired _are_ mandatory
      matchers.propertyEquals(pRule, pTo, "couldNotResolve") &&
      matchers.propertyEquals(pRule, pTo, "circular") &&
      matchers.propertyEquals(pRule, pTo, "dynamic") &&
      matchers.propertyEquals(pRule, pTo, "exoticallyRequired") &&
      matchers.propertyMatches(pRule, pTo, "license", "license") &&
      matchers.propertyMatchesNot(pRule, pTo, "licenseNot", "license") &&
      matchers.propertyMatches(pRule, pTo, "exoticRequire", "exoticRequire") &&
      matchers.propertyMatchesNot(
        pRule,
        pTo,
        "exoticRequireNot",
        "exoticRequire"
      ) &&
      matchers.toVia(pRule, pTo, lGroups) &&
      matchers.toViaOnly(pRule, pTo, lGroups) &&
      matchers.toViaNot(pRule, pTo, lGroups) &&
      matchers.toviaSomeNot(pRule, pTo, lGroups) &&
      matchers.toIsMoreUnstable(pRule, pFrom, pTo)
    );
  };
}
/**
 *
 * @param {any} pRule
 * @returns boolean
 */
const isInteresting = (pRule) =>
  !isModuleOnlyRule(pRule) && !isFolderScope(pRule);

module.exports = {
  match,
  isInteresting,
};
