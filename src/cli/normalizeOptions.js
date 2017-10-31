"use strict";

const DEFAULT_MODULE_SYSTEMS = ["cjs", "amd", "es6"];
const DEFAULT_RULES_FILE_NAME = ".dependency-cruiser.json";

function uniq(pArray) {
    return Array.from(new Set(pArray));
}

function normalizeModuleSystems(pSystemList) {
    let lRetval = DEFAULT_MODULE_SYSTEMS;

    if (typeof pSystemList === "string") {
        lRetval = pSystemList.split(",");
    }
    if (Array.isArray(pSystemList)) {
        lRetval = pSystemList;
    }

    return uniq(lRetval.sort());
}

function determineRulesFileName(pValidate) {
    if (typeof pValidate === 'boolean' && pValidate){
        return DEFAULT_RULES_FILE_NAME;
    } else {
        return pValidate;
    }
}

/**
 * returns the pOptions, so that the returned value contains a
 * valid value for each possible option
 *
 * @param  {object} pOptions [description]
 * @return {object}          [description]
 */
module.exports = (pOptions) => {
    pOptions = Object.assign(
        {
            doNotFollow: "",
            exclude: "",
            outputTo: "-",
            outputType: "err",
            system: DEFAULT_MODULE_SYSTEMS
        },
        pOptions
    );

    pOptions.moduleSystems = normalizeModuleSystems(pOptions.system);

    if (pOptions.hasOwnProperty("validate")){
        pOptions.rulesFile = determineRulesFileName(pOptions.validate);
    }

    pOptions.validate = pOptions.hasOwnProperty("validate");

    if (pOptions.hasOwnProperty("maxDepth")) {
        pOptions.maxDepth = parseInt(pOptions.maxDepth, 10);
    } else {
        pOptions.maxDepth = 0;
    }

    return pOptions;
};
