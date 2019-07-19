/* eslint-disable security/detect-object-injection */
const Handlebars     = require('handlebars/runtime');
const _get           = require('lodash/get');
const {getFormattedAllowedRule, mergeCountIntoRule, formatSummaryForReport} = require('./utl');

// eslint-disable-next-line import/no-unassigned-import
require("./err-html.template");


function aggregateViolations(pViolations, pRuleSetUsed) {
    const lViolationCounts = pViolations.reduce(
        (pAll, pCurrentViolation) => {
            if (pAll[pCurrentViolation.rule.name]) {
                pAll[pCurrentViolation.rule.name] += 1;
            } else {
                pAll[pCurrentViolation.rule.name] = 1;
            }
            return pAll;
        },
        {}
    );

    return _get(pRuleSetUsed, 'forbidden', [])
        .concat(getFormattedAllowedRule(pRuleSetUsed))
        .map(pRule => mergeCountIntoRule(pRule, lViolationCounts))
        .sort(
            (pFirst, pSecond) =>
                Math.sign(pSecond.count - pFirst.count) ||
                pFirst.name.localeCompare(pSecond.name)
        );
}

/**
 * Returns the results of a cruise in an 'incidence matrix'
 *
 * @param {any} pResults - the output of a dependency-cruise adhering to ../../extract/results-schema.json
 * @returns {string} - an html program showing the summary & the violations (if any)
 */
module.exports = pResults => Handlebars.templates['err-html.template.hbs'](
    {
        summary: {
            ...formatSummaryForReport(pResults.summary),
            agggregateViolations: aggregateViolations(
                pResults.summary.violations, pResults.summary.ruleSetUsed
            )
        }
    }
);
