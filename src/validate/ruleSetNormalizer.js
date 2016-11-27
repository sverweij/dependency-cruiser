"use strict";

const VALID_SEVERITIES  = /^(error|warning|information)$/;
const DEFAULT_SEVERITY = 'warning';
const DEFAULT_RULE  = 'unnamed';

function normalizeLevel (pLevel){
    let lLevel = pLevel ? pLevel : DEFAULT_SEVERITY;

    return Boolean(lLevel.match(VALID_SEVERITIES)) ? lLevel : DEFAULT_SEVERITY;
}

function normalizeName(pRule) {
    return pRule ? pRule : DEFAULT_RULE;
}

function normalizeRule(pRule) {
    return Object.assign(
        pRule,
        {
            severity : normalizeLevel(pRule.severity),
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
