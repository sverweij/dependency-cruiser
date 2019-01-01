const fs = require('fs');
const path          = require('path');
const _set          = require('lodash/set');
const _get          = require('lodash/get');
const _clone        = require('lodash/clone');
const compileConfig = require('./compileConfig');
const defaults      = require('./defaults.json');

function getOptionValue(pDefault) {
    return (pValue) => {
        let lRetval = pDefault;

        if (typeof pValue === 'string'){
            lRetval = pValue;
        }
        return lRetval;
    };
}

function normalizeConfigFile(pOptions, pConfigWrapperName, pDefault) {
    let lOptions = _clone(pOptions);

    if (lOptions.hasOwnProperty(pConfigWrapperName)) {
        _set(
            lOptions, `ruleSet.options.${pConfigWrapperName}.fileName`,
            getOptionValue(pDefault)(lOptions[pConfigWrapperName])
            /* eslint security/detect-object-injection: 0 */
        );
        Reflect.deleteProperty(lOptions, pConfigWrapperName);
    }

    if (_get(lOptions, `ruleSet.options.${pConfigWrapperName}`, null)) {
        if (!_get(lOptions, `ruleSet.options.${pConfigWrapperName}.fileName`, null)) {
            _set(
                lOptions, `ruleSet.options.${pConfigWrapperName}.fileName`,
                pDefault
            );
        }
    }

    return lOptions;
}

function fileExists (pFileName) {
    try {
        fs.accessSync(pFileName, fs.R_OK);
        return true;
    } catch (e) {
        return false;
    }
}

function validateAndGetCustomRulesFileName(pValidate) {
    let lRetval = '';

    if (fileExists(pValidate)) {
        lRetval = pValidate;
    } else {
        throw new Error(
            `Can't open '${pValidate}' for reading. Does it exist?` +
            ` (You can create a dependency-cruiser configuration file with depcruise --init .)\n`
        );
    }
    return lRetval;
}

function validateAndGetDefaultRulesFileName() {
    let lRetval = defaults.RULES_FILE_NAME_SEARCH_ARRAY.find(fileExists);

    if (typeof lRetval === 'undefined') {
        throw new Error(`Can't open '${defaults.RULES_FILE_NAME}' for reading. Does it exist?\n`);
    }
    return lRetval;
}

function validateAndNormalizeRulesFileName (pValidate) {
    let lRetval = '';

    if (typeof pValidate === 'string') {
        lRetval = validateAndGetCustomRulesFileName(pValidate);
    } else {
        lRetval = validateAndGetDefaultRulesFileName();
    }

    return lRetval;
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
            outputTo: defaults.OUTPUT_TO,
            outputType: defaults.OUTPUT_TYPE
        },
        pOptions
    );

    if (pOptions.hasOwnProperty("moduleSystems")) {
        pOptions.moduleSystems = pOptions.moduleSystems.split(",").map(pString => pString.trim());
    }

    if (pOptions.hasOwnProperty("config")){
        pOptions.validate = pOptions.config;
    }

    if (pOptions.hasOwnProperty("validate")){
        pOptions.rulesFile = validateAndNormalizeRulesFileName(pOptions.validate);
        pOptions.ruleSet   = compileConfig(
            path.isAbsolute(pOptions.rulesFile) ? pOptions.rulesFile : `./${pOptions.rulesFile}`
        );
        pOptions.validate = true;
    }

    pOptions = normalizeConfigFile(pOptions, "webpackConfig", defaults.WEBPACK_CONFIG);
    pOptions = normalizeConfigFile(pOptions, "tsConfig", defaults.TYPESCRIPT_CONFIG);

    pOptions.validate = pOptions.hasOwnProperty("validate");

    return pOptions;
};

module.exports.determineRulesFileName = getOptionValue(defaults.RULES_FILE_NAME);
