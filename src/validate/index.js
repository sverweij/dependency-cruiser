const has = require("lodash/has");
const matchModuleRule = require("./match-module-rule");
const matchDependencyRule = require("./match-dependency-rule");
const violatesRequiredRule = require("./violates-required-rule");
const matchFolderRule = require("./match-folder-dependency-rule");

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

  if (has(pRuleSet, "required")) {
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

/**
 *
 * @param {*} pRuleSet
 * @param {*} pFrom
 * @param {*} pTo
 * @param {*} pMatchModule
 * @returns {import(".").IValidationResult}
 */
function validateAgainstRules(pRuleSet, pFrom, pTo, pMatchModule) {
  /** @type {import(".").IValidationResult} */
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

module.exports = {
  module: (pRuleSet, pModule) =>
    validateAgainstRules(pRuleSet, pModule, {}, matchModuleRule),

  dependency: (pRuleSet, pFrom, pTo) =>
    validateAgainstRules(pRuleSet, pFrom, pTo, matchDependencyRule),

  folder: (pRuleSet, pFromFolder, pToFolder) =>
    validateAgainstRules(pRuleSet, pFromFolder, pToFolder, matchFolderRule),
};
