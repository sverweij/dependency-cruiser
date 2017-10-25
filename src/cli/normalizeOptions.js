"use strict";

const _ = require("lodash");

const DEFAULT_MODULE_SYSTEMS = ["cjs", "amd", "es6"];
const DEFAULT_RULES_FILE_NAME = ".dependency-cruiser.json";

function normalizeModuleSystems(pSystemList) {
    if (_.isString(pSystemList)) {
        return _(pSystemList.split(",")).sort().uniq().valueOf();
    }
    // istanbul ignore else
    if (_.isArray(pSystemList)) {
        return _(pSystemList).sort().uniq().valueOf();
    }
    // istanbul ignore next
    return DEFAULT_MODULE_SYSTEMS;
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
    pOptions = _.defaults(pOptions, {
        doNotFollow: "",
        exclude: "",
        outputTo: "-",
        outputType: "err",
        system: DEFAULT_MODULE_SYSTEMS
    });

    pOptions.moduleSystems = normalizeModuleSystems(pOptions.system);

    if (pOptions.hasOwnProperty("validate")){
        pOptions.rulesFile = determineRulesFileName(pOptions.validate);
    }

    pOptions.validate = pOptions.hasOwnProperty("validate");

    return pOptions;
};
