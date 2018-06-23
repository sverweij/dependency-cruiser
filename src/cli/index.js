"use strict";

const glob                  = require('glob');
const _get                  = require('lodash').get;
const main                  = require('../main');
const getResolveConfig      = require('./getResolveConfig');
const validateFileExistence = require('./validateFileExistence');
const normalizeOptions      = require('./normalizeOptions');
const initRules             = require('./initRules');
const io                    = require('./io');
const formatMetaInfo        = require('./formatMetaInfo');
const defaults              = require('./defaults.json');


function createRulesFile(pOptions) {
    initRules(normalizeOptions.determineRulesFileName(pOptions.validate));
    process.stdout.write(
        `\n  Successfully created '${normalizeOptions.determineRulesFileName(pOptions.validate)}'\n\n`
    );
}

function extractResolveOptions(pOptions) {
    return getResolveConfig(
        normalizeOptions.determineWebpackConfigFileName(
            _get(pOptions, 'ruleSet.options.webpackConfig.fileName', defaults.webpackConfig)
        ),
        _get(pOptions, 'ruleSet.options.webpackConfig.env', null),
        _get(pOptions, 'ruleSet.options.webpackConfig.arguments', null)
    );
}

function runCruise(pFileDirArray, pOptions) {
    let lResolveOptions = {};

    pFileDirArray
        .filter(pFileOrDir => !glob.hasMagic(pFileOrDir))
        .forEach(validateFileExistence);

    if (pOptions.hasOwnProperty("validate")) {
        validateFileExistence(normalizeOptions.determineRulesFileName(pOptions.validate));
    }

    pOptions = normalizeOptions(pOptions);

    if (pOptions.hasOwnProperty("webpackConfig") || _get(pOptions, 'ruleSet.options.webpackConfig', null)) {
        lResolveOptions = extractResolveOptions(pOptions);
    }

    const lDependencyList = main.cruise(pFileDirArray, pOptions, lResolveOptions);

    io.write(pOptions.outputTo, lDependencyList.modules);

    /* istanbul ignore if */
    if (lDependencyList.summary.error > 0) {
        process.exit(lDependencyList.summary.error);
    }
}

module.exports = (pFileDirArray, pOptions) => {
    pOptions = pOptions || {};

    try {
        if (pOptions.info === true) {
            process.stdout.write(formatMetaInfo());
        } else if (pOptions.init === true){
            createRulesFile(pOptions);
        } else {
            runCruise(pFileDirArray, pOptions);
        }
    } catch (e) {
        process.stderr.write(`\n  ERROR: ${e.message}\n`);
    }
};
/* eslint no-process-exit: 0 */
