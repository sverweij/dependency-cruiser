"use strict";

const fs                 = require("fs");
const validateParameters = require("./validateParameters");
const normalizeOptions   = require("./normalizeOptions");
const main               = require("../main");
const readRuleSet        = require('../validate/readRuleSet');

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

function write(pOutputTo, pContent) {
    if ("-" === pOutputTo) {
        process.stdout.write(pContent);
    } else {
        writeToFile(pOutputTo, pContent);
    }
}

module.exports = (pFileDirArray, pOptions) => {
    try {
        validateParameters(pFileDirArray, pOptions);
        pOptions = normalizeOptions(pOptions);

        if (Boolean(pOptions.rulesFile)){
            pOptions.ruleSet = readRuleSet(
                fs.readFileSync(pOptions.rulesFile, 'utf8')
            );
        }

        const lDependencyList = main(pFileDirArray, pOptions);

        write(pOptions.outputTo, lDependencyList.dependencies);

        /* istanbul ignore if */
        if (lDependencyList.summary.error > 0) {
            process.exit(lDependencyList.summary.error);
        }

    } catch (e) {
        process.stderr.write(`ERROR: ${e.message}`);
    }
};

/* eslint no-process-exit: 0 */
