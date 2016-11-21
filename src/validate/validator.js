"use strict";

const _         = require("lodash");
const fs        = require("fs");
const safeRegex = require('safe-regex');

function checkRuleSafety(pRule) {
    if (
        !(
            safeRegex(pRule.from) &&
            safeRegex(pRule.to)
        )
    ){
        throw new Error(
            `rule ${JSON.stringify(pRule, null, "")} has an unsafe regular expression. Bailing out.\n`
        );
    }
}

function validateRuleSet(pRuleSet) {
    if (pRuleSet.hasOwnProperty("allowed")){
        pRuleSet.allowed.forEach(checkRuleSafety);
    }
    if (pRuleSet.hasOwnProperty("forbidden")){
        pRuleSet.forbidden.forEach(checkRuleSafety);
    }
}

const readRules = _.memoize(
    pRuleSetFile => {
        let lRetval = JSON.parse(fs.readFileSync(pRuleSetFile, 'utf8'));

        validateRuleSet(lRetval);
        return lRetval;
    }
);


function matchRule(pFrom, pTo) {
    return pRule => pFrom.match(pRule.from) && pTo.match(pRule.to);
}

function validateAgainstRules(pRuleSet, pFrom, pTo) {
    let lRetval = true;

    if (pRuleSet.hasOwnProperty("allowed")){
        lRetval = lRetval && pRuleSet.allowed.some(matchRule(pFrom, pTo));
    }
    if (pRuleSet.hasOwnProperty("forbidden")){
        lRetval = lRetval && !(pRuleSet.forbidden.some(matchRule(pFrom, pTo)));
    }
    return lRetval;
}

function validate (pValidate, pRuleSetFile, pFrom, pTo) {
    if (!pValidate) {
        return true;
    }
    return validateAgainstRules(readRules(pRuleSetFile), pFrom, pTo);
}

exports.validate = validate;
