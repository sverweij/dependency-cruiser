"use strict";

const safeRegex = require('safe-regex');

function hasPath(pObject, pPath) {
    return pObject.hasOwnProperty(pPath[0]) &&
        pObject[pPath[0]].hasOwnProperty(pPath[1]);
}

function checkRuleSafety(pRule) {
    if (
        !(
            hasPath(pRule, ["from", "path"]) && safeRegex(pRule.from.path) &&
            hasPath(pRule, ["to", "path"]) && safeRegex(pRule.to.path)
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
