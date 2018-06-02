"use strict";

const safeRegex       = require('safe-regex');
const Ajv             = require('ajv');
const validateOptions = require('../options/validate');
const ruleSchema      = require('./jsonschema.json');

const ajv             = new Ajv();

function validateAgainstSchema(pSchema, pRuleSet) {
    if (!ajv.validate(pSchema, pRuleSet)) {
        throw new Error(
            `The rules file is not valid: ${ajv.errorsText()}.\n`
        );
    }
}

function hasPath(pObject, pSection, pCondition) {
    return pObject.hasOwnProperty(pSection) &&
        pObject[pSection].hasOwnProperty(pCondition);
}

function safeRule(pRule, pSection, pCondition) {
    return !hasPath(pRule, pSection, pCondition) || safeRegex(pRule[pSection][pCondition]);
}

function checkRuleSafety(pRule) {
    const REGEX_CONDITIONS = [
        {section: "from", condition: "path"},
        {section: "to", condition: "path"},
        {section: "from", condition: "pathNot"},
        {section: "to", condition: "pathNot"},
        {section: "to", condition: "license"},
        {section: "to", condition: "licenseNot"}
    ];

    if (REGEX_CONDITIONS.some(
        pCondition => !safeRule(pRule, pCondition.section, pCondition.condition)
    )){
        throw new Error(
            `rule ${JSON.stringify(pRule, null, "")} has an unsafe regular expression. Bailing out.\n`
        );
    }
}

/**
 * Returns the passed ruleset pRuleSet when it is valid.
 * Throws an Error in all other cases.
 *
 * Validations:
 * - the ruleset adheres to the [rule set json schema](jsonschema.json)
 * - any regular expression in the rule set is 'safe' (~= won't be too slow)
 *
 * @param  {object} pRuleSet The ruleset to validate
 * @return {object}          The ruleset as passed
 * @throws {Error}           An error with the reason for the error as
 *                           a message
 */
module.exports = (pRuleSet) => {
    validateAgainstSchema(ruleSchema, pRuleSet);
    (pRuleSet.allowed   || []).forEach(checkRuleSafety);
    (pRuleSet.forbidden || []).forEach(checkRuleSafety);
    if (pRuleSet.hasOwnProperty("options")){
        validateOptions(pRuleSet.options);
    }
    return pRuleSet;
};


/* think we can ignore object injection here because it's not a public function */
/* eslint security/detect-object-injection: 0 */
