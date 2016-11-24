"use strict";

const VALID_LEVELS  = /^(error|warning|information)$/;
const DEFAULT_LEVEL = 'warning';
const DEFAULT_RULE  = 'unnamed';

function normalizeLevel (pLevel){
    let lLevel = pLevel ? pLevel : DEFAULT_LEVEL;

    return Boolean(lLevel.match(VALID_LEVELS)) ? lLevel : DEFAULT_LEVEL;
}

function normalizeName(pRule) {
    return pRule ? pRule : DEFAULT_RULE;
}

function normalizeRule(pRule) {
    return Object.assign(
        pRule,
        {
            level : normalizeLevel(pRule.level),
            name  : normalizeName(pRule.name)
        }
    );
}

function normalize(pRuleSet) {
    if (pRuleSet.hasOwnProperty("allowed")){
        pRuleSet.allowed = pRuleSet.allowed.map(normalizeRule);
    }

    if (pRuleSet.hasOwnProperty("forbidden")){
        pRuleSet.forbidden = pRuleSet.forbidden.map(normalizeRule);
    }

    return pRuleSet;
}

exports.normalize = normalize;
