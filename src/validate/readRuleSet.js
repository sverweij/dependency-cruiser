"use strict";

const validateRuleSet  = require('./validateRuleSet');
const normalizeRuleSet = require('./normalizeRuleSet');

/**
 * For the given ruleset pRuleSetJSON:
 * - checks whether it is valid (and throws errors when it isn't)
 * - normalizes the ruleset (by using default values for non-filled out optional
 *   fields)
 *
 * ... and returns it as an object
 *
 * @param  {object} pRuleSetJSON    The to be validated ruleset (you can both pass
 *                                  an object or JSON as a string)
 * @return {object}                 The validated & normalized rule set
 */
module.exports = pRuleSetJSON =>
    normalizeRuleSet(
        validateRuleSet(
            typeof pRuleSetJSON === 'object' ? pRuleSetJSON : JSON.parse(pRuleSetJSON)
        )
    );
