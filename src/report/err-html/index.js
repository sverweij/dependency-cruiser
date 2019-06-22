/* eslint-disable security/detect-object-injection */
const Handlebars = require("handlebars/runtime");
const version = require('../../../package.json').version;

// eslint-disable-next-line import/no-unassigned-import
require("./err-html.template");


function mangle(pSummary) {
    return Object.assign(
        {},
        pSummary,
        {
            depcruiseVersion: `dependency-cruiser@${version}`,
            runDate: (new Date()).toISOString(),
            violations: pSummary.violations
        }
    );
}

function aggregateViolations(pViolations) {
    const lAggregateViolationsObject = pViolations.reduce(
        (pAll, pCurrentViolation) => {
            if (pAll[pCurrentViolation.rule.name]) {
                pAll[pCurrentViolation.rule.name].count += 1;
            } else {
                pAll[pCurrentViolation.rule.name] = {
                    count: 1,
                    severity: pCurrentViolation.rule.severity
                };
            }
            return pAll;
        },
        {}
    );

    return Object.keys(lAggregateViolationsObject).map(
        pKey => ({
            name: pKey,
            severity:lAggregateViolationsObject[pKey].severity,
            count: lAggregateViolationsObject[pKey].count
        })
    ).sort(
        (pFirst, pSecond) => Math.sign(pSecond.count - pFirst.count)
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
        summary: Object.assign(
            mangle(pResults.summary),
            {
                agggregateViolations: aggregateViolations(pResults.summary.violations)
            }
        )
    }
);
