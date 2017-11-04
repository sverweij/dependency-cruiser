"use strict";

const fs       = require('fs');
const defaults = require('./defaults.json');

function determineRulesFileName(pValidate) {
    if (typeof pValidate === 'boolean' && pValidate){
        return defaults.RULES_FILE_NAME;
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
            outputTo: defaults.OUTPUT_TO,
            outputType: defaults.OUTPUT_TYPE
        },
        pOptions
    );

    if (pOptions.hasOwnProperty("moduleSystems")) {
        pOptions.moduleSystems = pOptions.moduleSystems.split(",");
    }

    if (pOptions.hasOwnProperty("validate")){
        pOptions.rulesFile = determineRulesFileName(pOptions.validate);
        pOptions.ruleSet   = fs.readFileSync(pOptions.rulesFile, 'utf8');
    }

    pOptions.validate = pOptions.hasOwnProperty("validate");

    return pOptions;
};
