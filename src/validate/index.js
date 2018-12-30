const matchModuleRule     = require('./matchModuleRule');
const matchDependencyRule = require('./matchDependencyRule');

function compareSeverity(pFirst, pSecond) {
    const SEVERITY2INT = {
        "error": 1,
        "warn": 2,
        "info": 3
    };

    return SEVERITY2INT[pFirst.severity] - SEVERITY2INT[pSecond.severity];
}


function validateAgainstAllowedRules(pRuleSet, pMatchModule, pFrom, pTo) {
    let lFoundRuleViolations = [];

    if (pRuleSet.allowed) {
        const lInterestingAllowedRules = pRuleSet.allowed.filter(pMatchModule.isInteresting);

        if (
            lInterestingAllowedRules.length > 0 &&
            !(lInterestingAllowedRules.some(pMatchModule.match(pFrom, pTo)))
        ) {
            lFoundRuleViolations.push({
                severity: pRuleSet.allowedSeverity,
                name: "not-in-allowed"
            });
        }
    }
    return lFoundRuleViolations;
}

function validateAgainstForbiddenRules(pRuleSet, pMatchModule, pFrom, pTo) {
    pRuleSet.forbidden = pRuleSet.forbidden || [];

    return pRuleSet
        .forbidden
        .filter(pMatchModule.isInteresting)
        .filter(pMatchModule.match(pFrom, pTo))
        .map(pMatchedRule => ({
            severity: pMatchedRule.severity,
            name: pMatchedRule.name
        }));
}

function validateAgainstRules(pRuleSet, pFrom, pTo, pMatchModule) {
    let lRetval = {valid:true};

    const lFoundRuleViolations =
        validateAgainstAllowedRules(pRuleSet, pMatchModule, pFrom, pTo)
            .concat(validateAgainstForbiddenRules(pRuleSet, pMatchModule, pFrom, pTo))
            .sort(compareSeverity);

    lRetval.valid = lFoundRuleViolations.length === 0;
    if (!lRetval.valid){
        lRetval.rules = lFoundRuleViolations;
    }
    return lRetval;
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
            return {valid:true};
        }
        return validateAgainstRules(pRuleSet, pModule, {}, matchModuleRule);
    },
    dependency: (pValidate, pRuleSet, pFrom, pTo) => {
        if (!pValidate) {
            return {valid:true};
        }
        return validateAgainstRules(pRuleSet, pFrom, pTo, matchDependencyRule);
    }
};
