const _         = require("lodash");
const safeRegex = require('safe-regex');

const utl       = require("../utl");

const MODULE_SYSTEM_LIST_RE  = /^((cjs|amd|es6)(,|$))+$/gi;
const OUTPUT_TYPES_RE        = /(html|dot|csv|json)/g;

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

function validateValidationCombinations(pOptions) {
    if (
        pOptions.hasOwnProperty("validate") &&
        Boolean(pOptions.rulesFile) &&
        !(Boolean(pOptions.validate))
    ){
        throw Error(
            `Confused here. You passed a rules file, but don't want to validate? :-S`
        );
    }

    if (pOptions.hasOwnProperty("rulesFile")){
        validateFileExistence(pOptions.rulesFile);
    } else if (pOptions.validate){
        validateFileExistence(".dependency-cruiser.json");
    }
}

function validateParameters(pDirOrFile, pOptions) {
    validateFileExistence(pDirOrFile);
    if (Boolean(pOptions)) {
        validateSystems(pOptions.system);
        validateExcludePattern(pOptions.exclude);
        validateOutputType(pOptions.outputType);
        validateValidationCombinations(pOptions);
    }
}

exports.validate = validateParameters;
