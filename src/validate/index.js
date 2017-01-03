"use strict";

const path = require("path");

function propertyEquals(pTo, pRule, pProperty) {
    return pRule.to.hasOwnProperty(pProperty)
        ? pTo[pProperty] === pRule.to[pProperty]
        : true;
}

function matchesOwnFolder(pFrom, pTo, pOwnFolder) {
    return pOwnFolder ? path.dirname(pFrom).startsWith(path.dirname(pTo.resolved)) ||
                        path.dirname(pTo.resolved).startsWith(path.dirname(pFrom))
                      : !(path.dirname(pFrom).startsWith(path.dirname(pTo.resolved)) ||
                          path.dirname(pTo.resolved).startsWith(path.dirname(pFrom)));
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

function extractGroup(pRule, pActualPath) {
    let lRetval = null;

    if (Boolean(pRule.path)) {
        let lMatchResult = pActualPath.match(pRule.path);

        if (Boolean(lMatchResult) && lMatchResult.length > 1) {
            lRetval = lMatchResult[1];
        }
    }
    return lRetval;
}

function matchRule(pFrom, pTo) {
    return pRule => {
        const lGroup = extractGroup(pRule.from, pFrom);

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
                (Boolean(lGroup)
                    ? pTo.resolved.match(pRule.to.path.replace("$1", lGroup))
                    : pTo.resolved.match(pRule.to.path))
            ) && (!Boolean(pRule.to.pathNot) ||
                !(
                    (Boolean(lGroup)
                        ? pTo.resolved.match(pRule.to.pathNot.replace("$1", lGroup))
                        : pTo.resolved.match(pRule.to.pathNot))
                )
            ) && (!pRule.to.hasOwnProperty("ownFolder") ||
                matchesOwnFolder(pFrom, pTo, pRule.to.ownFolder)
            ) && (!pRule.to.hasOwnProperty("dependencyTypes") ||
                intersects(pTo.dependencyTypes, pRule.to.dependencyTypes)
            ) && (!pRule.to.hasOwnProperty("moreThanOneDependencyType") ||
                pTo.dependencyTypes.length > 1
            ) && propertyEquals(pTo, pRule, "coreModule") &&
            propertyEquals(pTo, pRule, "couldNotResolve");
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
