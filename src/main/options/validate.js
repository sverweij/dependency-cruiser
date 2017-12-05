"use strict";

const safeRegex = require('safe-regex');

const MODULE_SYSTEM_LIST_RE  = /^((cjs|amd|es6)(,|$))+$/gi;
const OUTPUT_TYPES_RE        = /^(html|dot|csv|err|json)$/g;
const VALID_DEPTH_RE         = /^[0-9]{1,2}$/g;

function validateSystems(pModuleSystems) {
    if (Boolean(pModuleSystems) && typeof Array.isArray(pModuleSystems)) {

        if (!pModuleSystems.every(
            pModuleSystem => Boolean(pModuleSystem.match(MODULE_SYSTEM_LIST_RE))
        )) {
            throw Error(`Invalid module system list: '${pModuleSystems.join(', ')}'\n`);
        }
    }
}

function isSafeRegExp(pPattern) {
    if (Boolean(pPattern) && !safeRegex(pPattern)) {
        throw Error(
            `The pattern '${pPattern}' will probably run very slowly - cowardly refusing to run.\n`
        );
    }
}

function validateOutputType(pOutputType) {
    if (Boolean(pOutputType) && !(pOutputType.match(OUTPUT_TYPES_RE))) {
        throw Error(
            `'${pOutputType}' is not a valid output type.\n`
        );
    }
}

function validateMaxDepth(pDepth) {
    if (Boolean(pDepth) && !(pDepth.match(VALID_DEPTH_RE))) {
        throw Error(
            `'${pDepth}' is not a valid depth - use an integer between 0 and 99`
        );
    }
}

function validate(pOptions) {
    let lRetval = {};

    if (Boolean(pOptions)) {
        validateSystems(pOptions.moduleSystems);
        isSafeRegExp(pOptions.exclude);
        isSafeRegExp(pOptions.doNotFollow);
        validateOutputType(pOptions.outputType);
        validateMaxDepth(pOptions.maxDepth);
        if (pOptions.hasOwnProperty('ruleSet') && pOptions.ruleSet.options) {
            lRetval = module.exports(pOptions.ruleSet.options);
        }
        return Object.assign(lRetval, pOptions);
    }
    return lRetval;
}

module.exports = validate;
