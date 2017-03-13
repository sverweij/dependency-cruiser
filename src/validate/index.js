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
        return (!Boolean(pRule.from.path) ||
                pFrom.match(pRule.from.path)
            ) && (!Boolean(pRule.from.pathNot) ||
                !(pFrom.match(pRule.from.pathNot))
            ) && (!Boolean(pRule.to.path) ||
                (lGroups.length > 0
                    ? pTo.resolved.match(replaceGroupPlaceholders(pRule.to.path, lGroups))
                    : pTo.resolved.match(pRule.to.path))
            ) && (!Boolean(pRule.to.pathNot) ||
                !(
                    (lGroups.length > 0
                        ? pTo.resolved.match(replaceGroupPlaceholders(pRule.to.pathNot, lGroups))
                        : pTo.resolved.match(pRule.to.pathNot))
                )
            ) && (!pRule.to.hasOwnProperty("dependencyTypes") ||
                intersects(pTo.dependencyTypes, pRule.to.dependencyTypes)
            ) && (!pRule.to.hasOwnProperty("moreThanOneDependencyType") ||
                pTo.dependencyTypes.length > 1
            ) && propertyEquals(pTo, pRule, "couldNotResolve");
    };
}

function validateAgainstRules(pRuleSet, pFrom, pTo) {
    let lMatchedRule = {};

    if (pRuleSet.hasOwnProperty("allowed")){
        lMatchedRule = pRuleSet.allowed.find(matchRule(pFrom, pTo));
        if (!Boolean(lMatchedRule)){
            return {
                valid: false,
                rule: {
                    severity: "warn",
                    name: "not-in-allowed"
                }
            };
        }
    }
    if (pRuleSet.hasOwnProperty("forbidden")){
        lMatchedRule = pRuleSet.forbidden.find(matchRule(pFrom, pTo));
        if (Boolean(lMatchedRule)){
            return {
                valid: false,
                rule: {
                    severity : lMatchedRule.severity,
                    name     : lMatchedRule.name
                }
            };
        }
    }
    return {valid:true};
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
/* eslint security/detect-object-injection: 0 */
