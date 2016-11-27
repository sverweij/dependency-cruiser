"use strict";

const fs                 = require("fs");
const extract            = require("../extract");
const validateParameters = require("./parameterValidator");
const normalizeOptions   = require("./optionNormalizer");
const reportHtml         = require("../report/htmlReporter");
const reportJson         = require("../report/jsonReporter");
const reportDot          = require("../report/dotReporter");
const reportCsv          = require("../report/csvReporter");
const reportErr          = require("../report/errReporter");

const TYPE2REPORTER      = {
    "json" : reportJson,
    "html" : reportHtml,
    "dot"  : reportDot,
    "csv"  : reportCsv,
    "err"  : reportErr
};

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

function calculateExitCode(pDependencyList, pOutputType) {
    const ERROR_CHROME_OFFSET = 5;

    if (pOutputType !== "err") {
        return 0;
    }
    return pDependencyList.split('\n').length - ERROR_CHROME_OFFSET;
}

module.exports = (pDirOrFile, pOptions) => {
    try {
        validateParameters(pDirOrFile, pOptions);
        pOptions = normalizeOptions(pOptions);
        let lDependencyList = extract(
            pDirOrFile,
            pOptions,
            TYPE2REPORTER[pOptions.outputType]
        );
        let lExitCode = calculateExitCode(lDependencyList, pOptions.outputType);

        write(
            pOptions.outputTo,
            lDependencyList
        );

        /* istanbul ignore if */
        if (lExitCode > 0) {
            process.exit(lExitCode);
        }

    } catch (e) {
        process.stderr.write(`ERROR: ${e.message}`);
    }
};

/* eslint no-process-exit: 0 */
