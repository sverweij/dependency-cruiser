const _get = require('lodash/get');
const isOrphan = require('./isOrphan');

function orphanCheckNecessary(pOptions){
    if (pOptions.forceOrphanCheck) {
        return true;
    }
    if (pOptions.validate) {
        return _get(pOptions, 'ruleSet.forbidden', []).some(
            pRule => pRule.from.hasOwnProperty("orphan")
        );
    }
    return false;
}


function addOrphanCheckToGraph(pDependencies){
    return pDependencies.map(
        pNode => Object.assign(
            {},
            pNode,
            isOrphan(pNode, pDependencies) ? {orphan: true} : {}
        )
    );
}

module.exports = (pDependencies, pOptions) => {
    if (orphanCheckNecessary(pOptions)){
        return addOrphanCheckToGraph(pDependencies);
    }
    return pDependencies;
};
