"use strict";

const validateRuleSet  = require('./validateRuleSet');
const normalizeRuleSet = require('./normalizeRuleSet');

module.exports = pRuleSetJSON =>
    normalizeRuleSet(
        validateRuleSet(
            typeof pRuleSetJSON === 'object' ? pRuleSetJSON : JSON.parse(pRuleSetJSON)
        )
    );
