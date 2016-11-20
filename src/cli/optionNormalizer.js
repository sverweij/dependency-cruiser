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

function normalizeValidation(pValidate, pRulesFile) {
    if (pRulesFile){
        return true;
    }
    if (Boolean(pValidate)){
        return true;
    }
    return false;
}

function normalize(pOptions){
    pOptions = _.defaults(pOptions, {
        exclude: "",
        outputTo: "-",
        outputType: "json",
        system: DEFAULT_MODULE_SYSTEMS
    });

    pOptions.moduleSystems = normalizeModuleSystems(pOptions.system);
    pOptions.validate = normalizeValidation(pOptions.validate, pOptions.rulesFile);
    if (pOptions.validate && !pOptions.hasOwnProperty("rulesFile")){
        pOptions.rulesFile = ".dependency-cruiser.json";
    }
    return pOptions;
}

exports.normalize = normalize;
