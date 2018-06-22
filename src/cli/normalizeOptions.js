"use strict";

const fs       = require('fs');
const _set     = require('lodash').set;
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

function trim(pString) {
    return pString.trim();
}

function determineWebpackConfigFileName(pPassedWebpackConfigFileName) {
    return getOptionValue(defaults.WEBPACK_CONFIG)(pPassedWebpackConfigFileName);
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
        pOptions.moduleSystems = pOptions.moduleSystems.split(",").map(trim);
    }

    if (pOptions.hasOwnProperty("validate")){
        pOptions.rulesFile = module.exports.determineRulesFileName(pOptions.validate);
        pOptions.ruleSet   = JSON.parse(fs.readFileSync(pOptions.rulesFile, 'utf8'));
    }

    if (pOptions.hasOwnProperty("webpackConfig")){
        _set(
            pOptions,
            "ruleSet.options.webpackConfig.fileName",
            determineWebpackConfigFileName(pOptions.webpackConfig)
        );
        Reflect.deleteProperty(pOptions, "webpackConfig");
    }

    pOptions.validate = pOptions.hasOwnProperty("validate");

    return pOptions;
};

module.exports.determineRulesFileName = getOptionValue(defaults.RULES_FILE_NAME);
module.exports.determineWebpackConfigFileName = determineWebpackConfigFileName;
