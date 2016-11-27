"use strict";

const _                 = require("lodash");
const fs                = require("fs");
const ruleSetValidator  = require('./ruleSetValidator');
const ruleSetNormalizer = require('./ruleSetNormalizer');

const readRules = _.memoize(
    pRuleSetFile => {
        let lRetval = JSON.parse(fs.readFileSync(pRuleSetFile, 'utf8'));

        ruleSetValidator.validate(lRetval);
        return ruleSetNormalizer.normalize(lRetval);
    }
);

function matchRule(pFrom, pTo) {
    return pRule => pFrom.match(pRule.from) && pTo.match(pRule.to);
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
                    severity: lMatchedRule.severity,
                    name : lMatchedRule.name
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
