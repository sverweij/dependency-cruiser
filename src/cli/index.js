"use strict";

const fs                    = require('fs');
const glob                  = require('glob');
const _get                  = require('lodash').get;
const main                  = require('../main');
const getResolveConfig      = require('./getResolveConfig');
const validateFileExistence = require('./validateFileExistence');
const normalizeOptions      = require('./normalizeOptions');
const initRules             = require('./initRules');
const formatMetaInfo        = require('./formatMetaInfo');
const defaults              = require('./defaults.json');

function writeToFile(pOutputTo, pDependencyString) {
    try {
        fs.writeFileSync(
            pOutputTo,
            pDependencyString,
            {encoding: "utf8", flag: "w"}
        );
    } catch (e) {
        process.stderr.write(`ERROR: Writing to '${pOutputTo}' didn't work. ${e}`);
    }
}

/**
 * Writes the string pString to stdout in chunks of pBufferSize size.
 *
 * When writing to a pipe, it's possible that pipe's buffer is full.
 * To prevent this problem from happening we should take the value at which
 * the OS guarantees atomic writes to pipes - which on my OSX machine is
 * 512 bytes. That seems pretty low (I've seen reports of 4k on the internet)
 * so it looks like a safe limit.
 *
 * @param  {string} pString The string to write
 * @param  {number} pBufferSize The size of the buffer to use.
 * @returns {void} nothing
 */
function writeToStdOut(pString, pBufferSize) {
    const lNumberOfChunks = Math.ceil(pString.length / pBufferSize);
    let i = 0;

    for (i = 0; i < lNumberOfChunks; i++) {
        process.stdout.write(pString.substr(i * pBufferSize, pBufferSize));
    }

}

function write(pOutputTo, pContent) {
    if ("-" === pOutputTo) {
        // OS pipe buffer size in bytes - which is what ulimit -a tells me on OSX
        writeToStdOut(pContent, defaults.PIPE_BUFFER_SIZE);
    } else {
        writeToFile(pOutputTo, pContent);
    }
}

function createRulesFile(pOptions) {
    initRules(normalizeOptions.determineRulesFileName(pOptions.validate));
    process.stdout.write(
        `\n  Successfully created '${normalizeOptions.determineRulesFileName(pOptions.validate)}'\n\n`
    );
}

function extractResolveOptions(pOptions) {
    return getResolveConfig(
        normalizeOptions.determineWebpackConfigFileName(
            pOptions.webpackConfig || _get(pOptions, 'ruleSet.options.webpackConfig.fileName', defaults.webpackConfig)
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

    write(pOptions.outputTo, lDependencyList.modules);

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
/* eslint no-process-exit: 0 no-plusplus: 0*/
