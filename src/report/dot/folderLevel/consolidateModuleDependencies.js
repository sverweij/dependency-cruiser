const _clone  = require('lodash/clone');
const _get    = require('lodash/get');
const _reject = require('lodash/reject');
const _uniqBy = require('lodash/uniqBy');

function mergeDependency(pLeftDependency, pRightDependency) {
    return Object.assign(
        {},
        pLeftDependency,
        pRightDependency,
        {
            dependendencyTypes: _uniqBy(pLeftDependency.dependendencyTypes.concat(pRightDependency.dependendencyTypes)),
            rules: pLeftDependency.rules.concat(_get(pRightDependency, 'rules', [])),
            valid: pLeftDependency.valid && pRightDependency.valid
        }
    );
}

function mergeDependencies(pResolvedName, pDependencies){
    return pDependencies
        .filter(
            pDependency => pDependency.resolved === pResolvedName
        )
        .reduce(
            (pAllDependencies, pCurrentDependency) => mergeDependency(pAllDependencies, pCurrentDependency),
            {
                dependendencyTypes: [],
                rules: [],
                valid: true
            }
        );
}

function consolidateDependencies(pDependencies) {
    let lDependencies = _clone(pDependencies);
    let lRetval = [];

    while (lDependencies.length > 0){
        lRetval.push(mergeDependencies(lDependencies[0].resolved, lDependencies));
        lDependencies = _reject(lDependencies, {resolved: lDependencies[0].resolved});
    }

    return lRetval;
}

function consolidateModuleDependencies(pModule) {
    return Object.assign(
        {},
        pModule,
        {dependencies: consolidateDependencies(pModule.dependencies)}
    );
}

module.exports = consolidateModuleDependencies;
