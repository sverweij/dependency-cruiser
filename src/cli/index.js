"use strict";

const fs                 = require("fs");
const extract            = require("../extract").extract;
const validateParameters = require("./parameterValidator").validate;
const normalizeOptions   = require("./optionNormalizer").normalize;
const reportHtml         = require("../report/htmlReporter").render;
const reportJson         = require("../report/jsonReporter").render;
const reportDot          = require("../report/dotReporter").render;
const reportCsv          = require("../report/csvReporter").render;
const reportErr          = require("../report/errReporter").render;

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

    if (pOutputType !== "err" || pDependencyList.length === 0) {
        return 0;
    }
    return pDependencyList.split('\n').length - ERROR_CHROME_OFFSET;
}

exports.main = (pDirOrFile, pOptions) => {
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
