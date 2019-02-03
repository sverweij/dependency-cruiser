const _clone  = require('lodash/clone');
const _reject = require('lodash/reject');

function mergeModule(pLeft, pRight) {
    return Object.assign(
        {},
        pLeft,
        pRight,
        {
            dependencies: pLeft
                .dependencies
                .concat(pRight.dependencies),
            valid: pLeft.valid && pRight.valid
        }
    );
}

function mergeModules(pSourceString, pModules){
    return pModules
        .filter(
            pModule => pModule.source === pSourceString
        )
        .reduce(
            (pAll, pCurrentModule) => mergeModule(pAll, pCurrentModule),
            {
                dependencies: [],
                valid: true
            }
        );
}

function consolidateModules(pModules){
    let lModules = _clone(pModules);
    let lRetval = [];

    while (lModules.length > 0){
        lRetval.push(mergeModules(lModules[0].source, lModules));
        lModules = _reject(lModules, {source: lModules[0].source});
    }
    return lRetval;
}

module.exports = consolidateModules;
