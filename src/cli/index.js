const fs                 = require("fs");
const extract            = require("../extract/extractor-composite").extract;
const validateParameters = require("./parameterValidator").validate;
const normalizeOptions   = require("./optionNormalizer").normalize;
const renderHtml         = require("../render/htmlRenderer").render;
const renderJson         = require("../render/jsonRenderer").render;
const renderDot          = require("../render/dotRenderer").render;

const TYPE2RENDERER      = {
    "json": renderJson,
    "html": renderHtml,
    "dot": renderDot
};

function writeToFile(pOutputTo, pDependencyString) {
    try {
        fs.writeFileSync(
            pOutputTo,
            pDependencyString,
            {encoding: "utf8", flag: "w"}
        );
    } catch (e) {
        process.stderr.write(`Writing to ${pOutputTo} didn't work. ${e}`);
    }
}

function write(pOutputTo, pContent) {
    if ("-" === pOutputTo) {
        process.stdout.write(pContent);
    } else {
        writeToFile(pOutputTo, pContent);
    }
}

exports.main = (pDirOrFile, pOptions) => {
    try {
        validateParameters(pDirOrFile, pOptions);
        pOptions = normalizeOptions(pOptions);
        write(
            pOptions.outputTo,
            extract(
                pDirOrFile,
                pOptions,
                TYPE2RENDERER[pOptions.outputType]
            )
        );
    } catch (e) {
        process.stderr.write(`ERROR: ${e.message}`);
    }
};
