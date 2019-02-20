const Ajv             = require('ajv');
const safeRegex       = require('../../utl/safe-regex');
const validateOptions = require('../options/validate');
const ruleSchema      = require('./jsonschema.json');

const ajv             = new Ajv();

function validateAgainstSchema(pSchema, pConfiguration) {
    if (!ajv.validate(pSchema, pConfiguration)) {
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
 * Returns the passed configuration pConfiguration when it is valid.
 * Throws an Error in all other cases.
 *
 * Validations:
 * - the ruleset adheres to the [rule set json schema](jsonschema.json)
 * - any regular expression in the rule set is 'safe' (~= won't be too slow)
 *
 * @param  {object} pConfiguration The configuration to validate
 * @return {object}                The configuration as passed
 * @throws {Error}                 An error with the reason for the error as
 *                                 a message
 */
module.exports = (pConfiguration) => {
    validateAgainstSchema(ruleSchema, pConfiguration);
    (pConfiguration.allowed   || []).forEach(checkRuleSafety);
    (pConfiguration.forbidden || []).forEach(checkRuleSafety);
    if (pConfiguration.hasOwnProperty("options")){
        validateOptions(pConfiguration.options);
    }
    return pConfiguration;
};


/* think we can ignore object injection here because it's not a public function */
/* eslint security/detect-object-injection: 0 */
