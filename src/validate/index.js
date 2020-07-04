const matchModuleRule = require("./match-module-rule");
const matchDependencyRule = require("./match-dependency-rule");
const matchers = require("./matchers");

function compareSeverity(pFirst, pSecond) {
  const SEVERITY2INT = {
    error: 1,
    warn: 2,
    info: 3,
  };

  return SEVERITY2INT[pFirst.severity] - SEVERITY2INT[pSecond.severity];
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

function violatesRequiredRule(pRule, pModule) {
  let lReturnValue = false;

  if (
    matchers.fromPath(pRule, pModule) &&
    matchers.fromPathNot(pRule, pModule)
  ) {
    lReturnValue = !pModule.dependencies.some((pDependency) =>
      matchers.toPath(pRule, pDependency)
    );
  }
  return lReturnValue;
}

function validateAgainstRequiredRules(pRuleSet, pMatchModule, pModule) {
  let lFoundRequiredRuleViolations = [];

  // TODO: that module comparison is not super elegant
  if (
    Object.prototype.hasOwnProperty.call(pRuleSet, "required") &&
    pMatchModule === matchModuleRule
  ) {
    lFoundRequiredRuleViolations = pRuleSet.required
      .filter((pRule) => violatesRequiredRule(pRule, pModule))
      // TODO: normalize severity and name upfront
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
    .concat(validateAgainstRequiredRules(pRuleSet, pMatchModule, pFrom))
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
 * @param  {Boolean} pValidate whether or not to validate at all
 * @param  {object} pRuleSet  a ruleset (adhering to
 *                            [the ruleset schema](jsonschema.json))
 * @param  {object} pFrom     The from part of the dependency
 * @param  {object} pTo       The 'to' part of the dependency
 * @return {object}           an object with as attributes:
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
  module: (pValidate, pRuleSet, pModule) => {
    if (!pValidate) {
      return { valid: true };
    }
    return validateAgainstRules(pRuleSet, pModule, {}, matchModuleRule);
  },
  dependency: (pValidate, pRuleSet, pFrom, pTo) => {
    if (!pValidate) {
      return { valid: true };
    }
    return validateAgainstRules(pRuleSet, pFrom, pTo, matchDependencyRule);
  },
};
