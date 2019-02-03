const _clone  = require('lodash/clone');
const _get    = require('lodash/get');
const _reject = require('lodash/reject');
const _uniqBy = require('lodash/uniqBy');

function mergeDependency(pLeft, pRight) {
    return Object.assign(
        {},
        pLeft,
        pRight,
        {
            dependendencyTypes: _uniqBy(pLeft.dependendencyTypes.concat(pRight.dependendencyTypes)),
            rules: pLeft.rules.concat(_get(pRight, 'rules', [])),
            valid: pLeft.valid && pRight.valid
        }
    );
}

function mergeDependencies(pResolvedName, pDependencies){
    return pDependencies
        .filter(
            pDependency => pDependency.resolved === pResolvedName
        )
        .reduce(
            (pAll, pCurrentDependency) => mergeDependency(pAll, pCurrentDependency),
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
