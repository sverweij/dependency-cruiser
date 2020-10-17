const _has = require("lodash/has");
const matchModuleRule = require("./match-module-rule");
const matchDependencyRule = require("./match-dependency-rule");
const violatesRequiredRule = require("./violates-required-rule");

function compareSeverity(pFirst, pSecond) {
  const lSeverity2Int = {
    error: 1,
    warn: 2,
    info: 3,
  };

  return lSeverity2Int[pFirst.severity] - lSeverity2Int[pSecond.severity];
}

function validateAgainstAllowedRules(pRuleSet, pMatchModule, pFrom, pTo) {
  let lFoundRuleViolations = [];

  if (pRuleSet.allowed) {
    const lInterestingAllowedRules = pRuleSet.allowed.filter(
      pMatchModule.isInteresting
    );

    if (
      lInterestingAllowedRules.length > 0 &&
      !lInterestingAllowedRules.some(pMatchModule.match(pFrom, pTo))
    ) {
      lFoundRuleViolations.push({
        severity: pRuleSet.allowedSeverity,
        name: "not-in-allowed",
      });
    }
  }
  return lFoundRuleViolations;
}

function validateAgainstForbiddenRules(pRuleSet, pMatchModule, pFrom, pTo) {
  pRuleSet.forbidden = pRuleSet.forbidden || [];

  return pRuleSet.forbidden
    .filter(pMatchModule.isInteresting)
    .filter(pMatchModule.match(pFrom, pTo))
    .map((pMatchedRule) => ({
      severity: pMatchedRule.severity,
      name: pMatchedRule.name,
    }));
}

function validateAgainstRequiredRules(pRuleSet, pModule, pMatchModule) {
  let lFoundRequiredRuleViolations = [];

  if (_has(pRuleSet, "required")) {
    lFoundRequiredRuleViolations = pRuleSet.required
      .filter(pMatchModule.isInteresting)
      .filter((pRule) => violatesRequiredRule(pRule, pModule))
      .map((pMatchedRule) => ({
        severity: pMatchedRule.severity,
        name: pMatchedRule.name,
      }));
  }
  return lFoundRequiredRuleViolations;
}

function validateAgainstRules(pRuleSet, pFrom, pTo, pMatchModule) {
  let lReturnValue = { valid: true };

  const lFoundRuleViolations = validateAgainstAllowedRules(
    pRuleSet,
    pMatchModule,
    pFrom,
    pTo
  )
    .concat(validateAgainstForbiddenRules(pRuleSet, pMatchModule, pFrom, pTo))
    .concat(validateAgainstRequiredRules(pRuleSet, pFrom, pMatchModule))
    .sort(compareSeverity);

  lReturnValue.valid = lFoundRuleViolations.length === 0;
  if (!lReturnValue.valid) {
    lReturnValue.rules = lFoundRuleViolations;
  }
  return lReturnValue;
}

/**
 * If pValidate equals true, validates the pFrom and pTo
 * dependency pair against the given ruleset pRuleSet
 *
 * @param  {import("../../types/rule-set").IFlattenedRuleSet} pRuleSet
 *    a ruleset (adhering to  [the ruleset schema](jsonschema.json))
 * @param  {import("../../types/cruise-result").IModule} pFrom
 *    The from part of the dependency
 * @param  {import("../../types/cruise-result").IModule} pTo
 *    The 'to' part of the dependency
 * @return {any}           an object with as attributes:
 *                            - valid: (boolean) true if the relation
 *                              between pTo and pFalse is valid (as far as the
 *                              given ruleset is concerend). false in all other
 *                              cases.
 *                            - rule (only when the relation between pFrom and
 *                              pTo was false):
 *                              - name: the name (from the ruleset) of the
 *                                  violated rule
 *                              - severity: the severity of that rule - as per
 *                                  the ruleset
 */
module.exports = {
  module: (pRuleSet, pModule) =>
    validateAgainstRules(pRuleSet, pModule, {}, matchModuleRule),
  dependency: (pRuleSet, pFrom, pTo) =>
    validateAgainstRules(pRuleSet, pFrom, pTo, matchDependencyRule),
};
