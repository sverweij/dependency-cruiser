"use strict";

const fs       = require('fs');
const _set     = require('lodash/set');
const _get     = require('lodash/get');
const _clone   = require('lodash/clone');
const defaults = require('./defaults.json');

function getOptionValue(pDefault) {
    return (pValue) => {
        let lRetval = pDefault;

        if (typeof pValue === 'string'){
            lRetval = pValue;
        }
        return lRetval;
    };
}

function normalizeWebPackConfig(pOptions) {
    let lOptions = _clone(pOptions);

    if (lOptions.hasOwnProperty("webpackConfig")) {
        _set(
            lOptions, "ruleSet.options.webpackConfig.fileName",
            getOptionValue(defaults.WEBPACK_CONFIG)(lOptions.webpackConfig)
        );
        Reflect.deleteProperty(lOptions, "webpackConfig");
    }

    if (_get(lOptions, "ruleSet.options.webpackConfig", null)) {
        if (!_get(lOptions, "ruleSet.options.webpackConfig.fileName", null)) {
            _set(
                lOptions, "ruleSet.options.webpackConfig.fileName",
                defaults.WEBPACK_CONFIG
            );
        }
    }

    return lOptions;
}


function normalizeTSConfig(pOptions) {
    let lOptions = _clone(pOptions);

    if (lOptions.hasOwnProperty("tsConfig")) {
        _set(
            lOptions, "ruleSet.options.tsConfig.fileName",
            getOptionValue(defaults.TYPESCRIPT_CONFIG)(lOptions.tsConfig)
        );
        Reflect.deleteProperty(lOptions, "tsConfig");
    }

    if (_get(lOptions, "ruleSet.options.tsConfig", null)) {
        if (!_get(lOptions, "ruleSet.options.tsConfig.fileName", null)) {
            _set(
                lOptions, "ruleSet.options.tsConfig.fileName",
                defaults.TYPESCRIPT_CONFIG
            );
        }
    }

    return lOptions;
}
/* eslint complexity:0 */
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

    if (pOptions.hasOwnProperty("validate")){
        pOptions.rulesFile = module.exports.determineRulesFileName(pOptions.validate);
        pOptions.ruleSet   = JSON.parse(fs.readFileSync(pOptions.rulesFile, 'utf8'));
    }

    pOptions = normalizeWebPackConfig(pOptions);
    pOptions = normalizeTSConfig(pOptions);

    pOptions.validate = pOptions.hasOwnProperty("validate");

    return pOptions;
};

module.exports.determineRulesFileName = getOptionValue(defaults.RULES_FILE_NAME);

