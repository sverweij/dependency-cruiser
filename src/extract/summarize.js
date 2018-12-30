const _flattenDeep = require('lodash/flattenDeep');

const dependencySortFn = (left, right) => `${left.from}|${left.to}` > `${right.from}|${right.to}` ? 1 : -1;

function cutNonTransgressions(pSourceEntry) {
    return {
        source       : pSourceEntry.source,
        dependencies : pSourceEntry.dependencies.filter(pDep => pDep.valid === false)
    };
}

function extractMetaData(pViolations) {
    return pViolations.reduce(
        (pAll, pThis) => {
            pAll[pThis.rule.severity] += 1;
            return pAll;
        }
        , {
            error : 0,
            warn  : 0,
            info  : 0
        }
    );
}

/**
 * Takes an array of dependencies, and extracts the violations from it.
 *
 * Each violation has a from a to and the violated rule () e.g.
 * {
 *      from: "./here.js",
 *      to: "./there.js",
 *      rule: {
 *          name: "some-rule",
 *          severity: "warn"
 *      }
 * }
 *
 * @param {any} pModules an array of modules
 * @return {any} an array of violations
 */
function extractDependencyViolations(pModules){
    return _flattenDeep(pModules
        .map(cutNonTransgressions)
        .filter(pModule => pModule.dependencies.length > 0)
        .map(
            pModule => pModule.dependencies.map(
                pDep => pDep.rules.map(
                    pRule => ({
                        from: pModule.source,
                        to: pDep.resolved,
                        rule: pRule
                    })
                )
            )
        )
    );
}

function extractModuleViolations(pModules){
    return _flattenDeep(pModules
        .filter(pModule => pModule.valid === false)
        .map(
            pModule => pModule.rules.map(
                pRule => ({
                    from: pModule.source,
                    to: pModule.source,
                    rule: pRule
                })
            )
        )
    );
}

module.exports = (pModules) => {
    const lViolations = extractDependencyViolations(pModules)
        .concat(extractModuleViolations(pModules))
        .sort(dependencySortFn);

    return Object.assign(
        {
            violations : lViolations
        },
        extractMetaData(lViolations),
        {
            totalCruised: pModules.length
        }
    );
};
