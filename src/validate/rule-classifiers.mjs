/**
 * @param {import("../../types/strict-rule-set").IStrictAnyRuleType} pRule a dependency-cruiser rule
 * @returns {boolean} whether or not the rule is 'module only'
 */
export function isModuleOnlyRule(pRule) {
  return (
    Object.hasOwn(pRule?.from ?? {}, "orphan") ||
    // note: the to might become optional for required rules
    Object.hasOwn(pRule?.to ?? {}, "reachable") ||
    Object.hasOwn(pRule, "module")
  );
}
/**
 *
 * @param {import("../../types/strict-rule-set").IStrictAnyRuleType} pRule
 * @returns {boolean} whether or not the scope of the rule is "folder" or something else
 */
export function isFolderScope(pRule) {
  // TODO might be possible to just rule pRule.scope as it's now
  // normalized away before getting here.
  return (pRule?.scope ?? "module") === "folder";
}

export default { isModuleOnlyRule, isFolderScope };
