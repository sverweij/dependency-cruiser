"use strict";

function propertyEquals(pTo, pRule, pProperty) {
    return pRule.to.hasOwnProperty(pProperty)
        ? pTo[pProperty] === pRule.to[pProperty]
        : true;
}

function intersects(pToDependencyTypes, pRuleDependencyTypes) {
    return pToDependencyTypes.some(
        pDepType => pRuleDependencyTypes.some(
            pRDepType => pDepType === pRDepType
        )
    );
}


/* if there is at least one group expression in the given pRulePath
   return the first matched one.
   return null in all other cases

   This fills our current need. Later we can expand it to return all group
   matches.
*/

function extractGroups(pRule, pActualPath) {
    let lRetval = [];

    if (Boolean(pRule.path)) {
        let lMatchResult = pActualPath.match(pRule.path);

        if (Boolean(lMatchResult) && lMatchResult.length > 1) {
            lRetval = lMatchResult;
        }
    }
    return lRetval;
}

function replaceGroupPlaceholders(pString, pExtractedGroups) {
    return pExtractedGroups.reduce(
        (pAll, pThis, pIndex) => pAll.replace(`$${pIndex}`, pThis),
        pString
    );
}

function matchRule(pFrom, pTo) {
    return pRule => {
        const lGroups = extractGroups(pRule.from, pFrom);

        /*
         * the replace("$1", lGroup) things below are a bit simplistic (they
         * also match \$, which they probably shouldn't) - but good enough for
         * now.
         */
        return (!pRule.from.path ||
                pFrom.match(pRule.from.path)
        ) && (!pRule.from.pathNot ||
                !(pFrom.match(pRule.from.pathNot))
        ) && (!pRule.to.path ||
                (lGroups.length > 0
                    ? pTo.resolved.match(replaceGroupPlaceholders(pRule.to.path, lGroups))
                    : pTo.resolved.match(pRule.to.path)
                )
        ) && (!Boolean(pRule.to.pathNot) ||
                !(lGroups.length > 0
                    ? pTo.resolved.match(replaceGroupPlaceholders(pRule.to.pathNot, lGroups))
                    : pTo.resolved.match(pRule.to.pathNot)
                )
        ) && (!pRule.to.dependencyTypes ||
                intersects(pTo.dependencyTypes, pRule.to.dependencyTypes)
        ) && (!pRule.to.hasOwnProperty("moreThanOneDependencyType") ||
                pTo.dependencyTypes.length > 1
        ) && (!pRule.to.license ||
                pTo.license && pTo.license.match(pRule.to.license)
        ) && (!pRule.to.licenseNot ||
                pTo.license && !pTo.license.match(pRule.to.licenseNot)
        ) && propertyEquals(pTo, pRule, "couldNotResolve") &&
                 propertyEquals(pTo, pRule, "circular");
    };
}

function compareSeverity(pFirst, pSecond) {
    const SEVERITY2INT = {
        "error": 1,
        "warn": 2,
        "info": 3
    };

    return SEVERITY2INT[pFirst.severity] - SEVERITY2INT[pSecond.severity];
}

function validateAgainstRules(pRuleSet, pFrom, pTo) {
    let lFoundRuleViolations = [];
    let lRetval = {valid:true};

    if (pRuleSet.allowed){
        if (!Boolean(pRuleSet.allowed.some(matchRule(pFrom, pTo)))){
            lFoundRuleViolations.push({
                severity: pRuleSet.allowedSeverity,
                name: "not-in-allowed"
            });
        }
    }
    if (pRuleSet.forbidden){
        lFoundRuleViolations = lFoundRuleViolations
            .concat(
                pRuleSet
                    .forbidden
                    .filter(matchRule(pFrom, pTo))
                    .map(pMatchedRule => ({
                        severity : pMatchedRule.severity,
                        name     : pMatchedRule.name
                    }))
            );
    }

    lRetval.valid = lFoundRuleViolations.length === 0;
    lFoundRuleViolations = lFoundRuleViolations.sort(compareSeverity);
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
module.exports = (pValidate, pRuleSet, pFrom, pTo) => {
    if (!pValidate) {
        return {valid:true};
    }
    return validateAgainstRules(pRuleSet, pFrom, pTo);
};

/* ignore security/detect-object-injection because:
   - we only use it from within the module with two fixed values
   - the propertyEquals function is not exposed externaly
 */
/* eslint security/detect-object-injection: 0, complexity: 0 */
