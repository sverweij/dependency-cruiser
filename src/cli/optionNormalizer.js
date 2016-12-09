"use strict";

const _ = require("lodash");

const DEFAULT_MODULE_SYSTEMS = ["cjs", "amd", "es6"];

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
        return ".dependency-cruiser.json";
    } else {
        return pValidate;
    }
}

function normalize(pOptions){
    pOptions = _.defaults(pOptions, {
        exclude: "",
        outputTo: "-",
        outputType: "json",
        system: DEFAULT_MODULE_SYSTEMS
    });

    pOptions.moduleSystems = normalizeModuleSystems(pOptions.system);

    if (pOptions.hasOwnProperty("validate")){
        pOptions.rulesFile = determineRulesFileName(pOptions.validate);
    }

    pOptions.validate = pOptions.hasOwnProperty("validate");

    return pOptions;
}

module.exports = normalize;
