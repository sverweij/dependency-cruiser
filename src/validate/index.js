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

function matchRule(pFrom, pTo) {
    return pRule =>
        (!Boolean(pRule.from.path)    ||   pFrom.match(pRule.from.path)) &&
        (!Boolean(pRule.from.pathNot) || !(pFrom.match(pRule.from.pathNot))) &&
        (!Boolean(pRule.to.path)      ||   pTo.resolved.match(pRule.to.path)) &&
        (!Boolean(pRule.to.pathNot)   || !(pTo.resolved.match(pRule.to.pathNot))) &&
        (!pRule.to.hasOwnProperty("ownFolder") || matchesOwnFolder(pFrom, pTo, pRule.to.ownFolder)) &&
        (!pRule.to.hasOwnProperty("dependencyTypes") || intersects(pTo.dependencyTypes, pRule.to.dependencyTypes)) &&
        (!pRule.to.hasOwnProperty("moreThanOneDependencyType") || pTo.dependencyTypes.length > 1) &&
        propertyEquals(pTo, pRule, "coreModule") &&
        propertyEquals(pTo, pRule, "couldNotResolve");
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
