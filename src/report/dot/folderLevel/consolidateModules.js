const _clone  = require('lodash/clone');
const _reject = require('lodash/reject');

function mergeModule(pLeftModule, pRightModule) {
    return Object.assign(
        {},
        pLeftModule,
        pRightModule,
        {
            dependencies: pLeftModule.dependencies
                .concat(pRightModule.dependencies),
            valid: pLeftModule.valid && pRightModule.valid
        }
    );
}

function mergeModules(pSourceString, pModules){
    return pModules
        .filter(
            pModule => pModule.source === pSourceString
        )
        .reduce(
            (pAllModules, pCurrentModule) => mergeModule(pAllModules, pCurrentModule),
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
