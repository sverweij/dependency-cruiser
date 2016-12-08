"use strict";

const _         = require("lodash");
const safeRegex = require('safe-regex');

const utl       = require("../utl");

const MODULE_SYSTEM_LIST_RE  = /^((cjs|amd|es6)(,|$))+$/gi;
const OUTPUT_TYPES_RE        = /(html|dot|csv|err|json|vis)/g;

function validateFileExistence(pDirOrFile) {
    if (!utl.fileExists(pDirOrFile)) {
        throw Error(`Can't open '${pDirOrFile}' for reading. Does it exist?\n`);
    }
}

function validateSystems(pSystem) {
    if (Boolean(pSystem) && _.isString(pSystem)) {
        const lParamArray = pSystem.match(MODULE_SYSTEM_LIST_RE);

        if (!lParamArray || lParamArray.length !== 1) {
            throw Error(`Invalid module system list: '${pSystem}'\n`);
        }
    }
}

function validateExcludePattern(pExclude) {
    if (Boolean(pExclude) && !safeRegex(pExclude)) {
        throw Error(
            `The exclude pattern '${pExclude}' will probably run very slowly - cowardly refusing to run.\n`
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

function validateValidation(pOptions) {
    if (pOptions.hasOwnProperty("validate") && typeof pOptions.validate !== 'boolean'){
        validateFileExistence(pOptions.validate);
    } else if (pOptions.validate === true){
        validateFileExistence(".dependency-cruiser.json");
    }
}

function validateParameters(pDirOrFile, pOptions) {
    validateFileExistence(pDirOrFile);
    if (Boolean(pOptions)) {
        validateSystems(pOptions.system);
        validateExcludePattern(pOptions.exclude);
        validateOutputType(pOptions.outputType);
        validateValidation(pOptions);
    }
}

module.exports = validateParameters;
