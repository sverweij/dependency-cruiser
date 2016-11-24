"use strict";

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

function validate(pRuleSet) {
    if (pRuleSet.hasOwnProperty("allowed")){
        pRuleSet.allowed.forEach(checkRuleSafety);
    }
    if (pRuleSet.hasOwnProperty("forbidden")){
        pRuleSet.forbidden.forEach(checkRuleSafety);
    }
}

exports.validate = validate;
