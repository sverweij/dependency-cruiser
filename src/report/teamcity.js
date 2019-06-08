const _get = require('lodash/get');
const tsm = require('teamcity-service-messages');

const CATEGORY = 'dependency-cruiser';
const SEVERITY2TEAMCITY_SEVERITY = {
    'error': "ERROR",
    'warn': "WARNING",
    'info': "INFO"
};

function severity2teamcitySeverity(pSeverity) {
    // eslint-disable-next-line security/detect-object-injection
    return SEVERITY2TEAMCITY_SEVERITY[pSeverity];
}

function reportForbiddenRules(pForbiddenRules, pViolations) {
    return pForbiddenRules
        .filter(pForbiddenRule => pViolations.some(pViolation => pForbiddenRule.name === pViolation.rule.name))
        .map(pForbiddenRule =>
            tsm.inspectionType(
                {
                    id: pForbiddenRule.name,
                    name: pForbiddenRule.name,
                    description: pForbiddenRule.comment || pForbiddenRule.name,
                    category: CATEGORY
                }
            )
        );
}

function reportAllowedRule(pAllowedRule, pViolations) {
    let lRetval = [];

    if (pAllowedRule.length > 0 && pViolations.some(pViolation => pViolation.rule.name === "not-in-allowed")) {
        lRetval = tsm.inspectionType(
            {
                id: "not-in-allowed",
                name: "not-in-allowed",
                description: "dependency is not in the 'allowed' set of rules",
                category: CATEGORY
            }
        );
    }
    return lRetval;
}

function reportViolatedRules(pRuleSetUsed, pViolations) {
    return reportForbiddenRules(_get(pRuleSetUsed, 'forbidden', []), pViolations)
        .concat(reportAllowedRule(_get(pRuleSetUsed, 'allowed', []), pViolations));
}

function bakeViolationMessage(pViolation) {
    return pViolation.from === pViolation.to ? pViolation.from : `${pViolation.from} -> ${pViolation.to}`;
}
function reportViolations(pViolations) {
    return pViolations.map(pViolation =>
        tsm.inspection(
            {
                typeId: pViolation.rule.name,
                message: bakeViolationMessage(pViolation),
                file: pViolation.from,
                SEVERITY: severity2teamcitySeverity(pViolation.rule.severity)
            }
        )
    );
}

/**
 * Returns a bunch of TeamCity service messages:
 * - for each rule in the passed results: an `inspectionType` with the name and comment of that rule
 * - for each violation in the passed results: an `inspection` with the violated rule name and the tos and froms
 *
 * @param {any} pResults - the output of a dependency-cruise adhering to ../extract/results-schema.json
 * @returns {string} - a '\n' separated string of TeamCity service messages
 */
module.exports = (pResults) => {
    // this is the documented way to get tsm to emit strings
    // Alternatively we could've used tne 'low level API', which
    // involves creating new `Message`s and stringifying those.
    // The abstraction of the 'higher level API' makes this
    // reporter more easy to implement and maintain, despite
    // setting this property directly
    tsm.stdout = false;

    const lRuleSet = _get(pResults, 'summary.ruleSetUsed', []);
    const lViolations = _get(pResults, 'summary.violations', []);

    return reportViolatedRules(lRuleSet, lViolations)
        .concat(reportViolations(lViolations))
        .reduce((pAll, pCurrent) => `${pAll}${pCurrent}\n`, '');
};
