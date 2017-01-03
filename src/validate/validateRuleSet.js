"use strict";

const safeRegex  = require('safe-regex');
const Ajv        = require('ajv');
const ruleSchema = require('./jsonschema.json');

const ajv        = new Ajv();

function validateAgainstSchema(pSchema, pRuleSet) {
    if (!ajv.validate(pSchema, pRuleSet)) {
        throw new Error(
            `The rules file is not valid: ${ajv.errorsText()}.\n`
        );
    }
}

function hasPath(pObject, pPath) {
    return pObject.hasOwnProperty(pPath[0]) &&
        pObject[pPath[0]].hasOwnProperty(pPath[1]);
}

function checkRuleSafety(pRule) {
    if (
        !(
            (!hasPath(pRule, ["from", "path"]) || safeRegex(pRule.from.path)) &&
            (!hasPath(pRule, ["to", "path"]) || safeRegex(pRule.to.path)) &&
            (!hasPath(pRule, ["from", "pathNot"]) || safeRegex(pRule.from.pathNot)) &&
            (!hasPath(pRule, ["to", "pathNot"]) || safeRegex(pRule.to.pathNot))
        )
    ){
        throw new Error(
            `rule ${JSON.stringify(pRule, null, "")} has an unsafe regular expression. Bailing out.\n`
        );
    }
}

module.exports = (pRuleSet) => {
    validateAgainstSchema(ruleSchema, pRuleSet);
    if (pRuleSet.hasOwnProperty("allowed")){
        pRuleSet.allowed.forEach(checkRuleSafety);
    }
    if (pRuleSet.hasOwnProperty("forbidden")){
        pRuleSet.forbidden.forEach(checkRuleSafety);
    }
    return pRuleSet;
};
