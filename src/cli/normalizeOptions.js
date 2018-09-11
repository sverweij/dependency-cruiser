"use strict";

const fs       = require('fs');
const _set     = require('lodash/set');
const _get     = require('lodash/get');
const _clone   = require('lodash/clone');
const stripJSONComments = require('strip-json-comments');
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

function normalizeConfigFile(pOptions, pConfigWrapperName, pDefault) {
    let lOptions = _clone(pOptions);

    if (lOptions.hasOwnProperty(pConfigWrapperName)) {
        _set(
            lOptions, `ruleSet.options.${pConfigWrapperName}.fileName`,
            getOptionValue(pDefault)(lOptions[pConfigWrapperName])
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
/* eslint security/detect-object-injection: 0 */

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
        pOptions.ruleSet   = JSON.parse(
            stripJSONComments(
                fs.readFileSync(pOptions.rulesFile, 'utf8')
            )
        );
    }

    pOptions = normalizeConfigFile(pOptions, "webpackConfig", defaults.WEBPACK_CONFIG);
    pOptions = normalizeConfigFile(pOptions, "tsConfig", defaults.TYPESCRIPT_CONFIG);

    pOptions.validate = pOptions.hasOwnProperty("validate");

    return pOptions;
};

module.exports.determineRulesFileName = getOptionValue(defaults.RULES_FILE_NAME);

