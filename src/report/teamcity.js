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

function reportForbiddenRules(pForbiddenRules) {
    return pForbiddenRules.map(pForbiddenRule =>
        tsm.inspectionType(
            {
                id: pForbiddenRule.name,
                name: pForbiddenRule.name,
                description: pForbiddenRule.comment,
                category: CATEGORY
            }
        )
    );
}

function reportAllowedRule(pAllowedRule) {
    let lRetval = [];

    if (pAllowedRule.length > 0) {
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

function reportUsedRules(pRuleSetUsed) {
    return reportForbiddenRules(_get(pRuleSetUsed, 'forbidden', []))
        .concat(reportAllowedRule(_get(pRuleSetUsed, 'allowed', [])));
}

function bakeViolationMessage(pViolation) {
    return `${pViolation.from} -> ${pViolation.to}`;
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

module.exports = (pInput) => {
    tsm.stdout = false;
    return reportUsedRules(_get(pInput, 'summary.ruleSetUsed', []))
        .concat(reportViolations(_get(pInput, 'summary.violations', [])))
        .join('\n');
};
