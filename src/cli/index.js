const fs                 = require("fs");
const extract            = require("../extract/extractor-composite").extract;
const validateParameters = require("./parameterValidator").validate;
const normalizeOptions   = require("./optionNormalizer").normalize;
const renderHtml         = require("../render/htmlRenderer").render;
const renderJson         = require("../render/jsonRenderer").render;
const renderDot          = require("../render/dotRenderer").render;
const renderCsv          = require("../render/csvRenderer").render;
const renderErr          = require("../render/errRenderer").render;

const TYPE2RENDERER      = {
    "json" : renderJson,
    "html" : renderHtml,
    "dot"  : renderDot,
    "csv"  : renderCsv,
    "err"  : renderErr
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
    if (pOutputType !== "err") {
        return 0;
    }
    return pDependencyList.split('\n').length - 1;
}

exports.main = (pDirOrFile, pOptions) => {
    try {
        validateParameters(pDirOrFile, pOptions);
        pOptions = normalizeOptions(pOptions);
        let lDependencyList = extract(
            pDirOrFile,
            pOptions,
            TYPE2RENDERER[pOptions.outputType]
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
