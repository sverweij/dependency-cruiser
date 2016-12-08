"use strict";

const _                 = require("lodash");
const fs                = require("fs");
const ruleSetValidator  = require('./ruleSetValidator');
const ruleSetNormalizer = require('./ruleSetNormalizer');

const readRules = _.memoize(
    pRuleSetFile => {
        let lRetval = JSON.parse(fs.readFileSync(pRuleSetFile, 'utf8'));

        ruleSetValidator(lRetval);
        return ruleSetNormalizer(lRetval);
    }
);

function propertyEquals(pTo, pRule, pProperty) {
    return pRule.to.hasOwnProperty(pProperty)
        ? pTo[pProperty] === pRule.to[pProperty]
        : true;
}

function matchRule(pFrom, pTo) {
    return pRule =>
        (!Boolean(pRule.from.path)    ||   pFrom.match(pRule.from.path)) &&
        (!Boolean(pRule.from.pathNot) || !(pFrom.match(pRule.from.pathNot))) &&
        (!Boolean(pRule.to.path)      ||   pTo.resolved.match(pRule.to.path)) &&
        (!Boolean(pRule.to.pathNot)   || !(pTo.resolved.match(pRule.to.pathNot))) &&
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

function validate (pValidate, pRuleSetFile, pFrom, pTo) {
    if (!pValidate) {
        return {valid:true};
    }
    return validateAgainstRules(readRules(pRuleSetFile), pFrom, pTo);
}

exports.validate = validate;

/* ignore security/detect-object-injection because:
   - we only use it from within the module with two fixed values
   - the propertyEquals function is not exposed externaly
 */
/* eslint security/detect-object-injection: 0 */
