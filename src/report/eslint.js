const _get = require('lodash/get');

const ESLINT_SEVERITY_ERROR = 2;
const ESLINT_SEVERITY_WARN = 1;

const SEVERITY2ESLINTSEVERITY = {
    "error": ESLINT_SEVERITY_ERROR,
    "warn": ESLINT_SEVERITY_WARN,
    "info": ESLINT_SEVERITY_WARN
};

function translateSeverity(pSeverity) {
    // eslint-disable-next-line security/detect-object-injection
    return SEVERITY2ESLINTSEVERITY[pSeverity];
}

function transformModuleTransgression(pModule) {
    return _get(pModule, "rules", []).map(
        pRule => (
            {
                ruleId: pRule.name,
                severity: translateSeverity(pRule.severity),
                message: "",
                line: 0,
                column: 0
            }
        )
    );
}

function transformDependencyTransgressions(pModule) {
    return _get(pModule, "dependencies", [])
        .filter(pDep => pDep.hasOwnProperty("rules"))
        .reduce(
            (pAll, pCurrent) => {
                const lMappedRules = pCurrent.rules.map(
                    pRule => (
                        {
                            ruleId: pRule.name,
                            severity: translateSeverity(pRule.severity),
                            message: `-> ${pCurrent.resolved}`,
                            line: 0,
                            column: 0
                        }
                    )
                );

                return pAll.concat(lMappedRules);
            },
            []
        );
}

function transformTransgressions(pModule) {
    return transformModuleTransgression(pModule)
        .concat(
            transformDependencyTransgressions(pModule)
        );
}

function transform(pInput) {
    return pInput.modules
        .filter(
            pModule => transformTransgressions(pModule).length > 0
        )
        .map(
            pOffendingModule => {
                const lTransgressions = transformTransgressions(pOffendingModule);

                return {
                    filePath: pOffendingModule.source,
                    messages: lTransgressions,
                    errorCount: lTransgressions.filter(
                        pTransgression => pTransgression.severity === ESLINT_SEVERITY_ERROR
                    ).length,
                    warningCount: lTransgressions.filter(
                        pTransgression => pTransgression.severity === ESLINT_SEVERITY_WARN
                    ).length,
                    fixableErrorCount: 0,
                    fixableWarningCount: 0
                };
            }
        );
}

/**
 * Returns a json string as documented
 * [on eslint.org ](https://eslint.org/docs/developer-guide/working-with-custom-formatters#the-results-object)
 *
 * @param {any} pInput - dependency graph adhering to ../../extract/results-schema.json
 * @returns {string} - eslint json format
 */
module.exports = pInput => JSON.stringify(transform(pInput), null, "  ");
