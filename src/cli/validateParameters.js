"use strict";

const _         = require("lodash");
const fs        = require('fs');
const safeRegex = require('safe-regex');

const MODULE_SYSTEM_LIST_RE  = /^((cjs|amd|es6)(,|$))+$/gi;
const OUTPUT_TYPES_RE        = /^(html|dot|csv|err|json)$/g;

function validateFileExistence(pDirOrFile) {
    try {
        fs.accessSync(pDirOrFile, fs.R_OK);
    } catch (e) {
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

function validateValidation(pOptions) {
    if (pOptions.hasOwnProperty("validate") && typeof pOptions.validate !== 'boolean'){
        validateFileExistence(pOptions.validate);
    } else if (pOptions.validate === true){
        validateFileExistence(".dependency-cruiser.json");
    }
}

module.exports = (pFileDirArray, pOptions) => {
    pFileDirArray.forEach(validateFileExistence);
    if (Boolean(pOptions)) {
        validateSystems(pOptions.system);
        isSafeRegExp(pOptions.exclude);
        isSafeRegExp(pOptions.doNotFollow);
        validateOutputType(pOptions.outputType);
        validateValidation(pOptions);
    }
};
