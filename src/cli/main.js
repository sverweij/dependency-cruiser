"use strict";

const extract    = require("../extract");
const reportHtml = require("../report/htmlReporter");
const reportJson = require("../report/jsonReporter");
const reportDot  = require("../report/dotReporter");
const reportCsv  = require("../report/csvReporter");
const reportErr  = require("../report/errReporter");
const reportVis  = require("../report/visReporter");

const TYPE2REPORTER      = {
    "json" : reportJson,
    "html" : reportHtml,
    "dot"  : reportDot,
    "csv"  : reportCsv,
    "err"  : reportErr,
    "vis"  : reportVis
};

/**
 * Cruises through and returns the dependencies in a directory, or
 * starting with a file. Supports javascript (ES2015 and older), typescript
 * and coffeescript.
 *
 * The options influence how the function returns the dependencies.
 * {
 *  validate   : if true, will attempt to validate with the rules in rulesFile.
 *               Default false.
 *  rulesFile  : A string pointing to a file containing rules to validate (NOTE:
 *               we'll change this to a rulesObject in the near future)
 *  exclude    : regular expression describing which dependencies the function
 *               should not cruise
 *  system     : an array of module systems to use for following dependencies;
 *               defaults to ["es6", "cjs", "amd"]
 *  outputType : one of "json", "html", "dot", "csv", "err" or "vis". When left
 *               out the function will return a javascript object as content
 * }
 *
 * @param  {string} pDirOrFile The directory to cruise or the file to start
 *                             the cruise with
 * @param  {object} pOptions   see above
 * @return {object}
 * {
 *  content : when outputType is defined: a string containing the dependencies
 *            in the format specified in outputType
 *            In all other cases: a javascript with the dependencies
 *  meta    : meta data with a summary of
 *           { error : the number of errors,
 *             warn  : the number of warnings,
 *             info  : the number of informational messages
 *           }
 *  (currently working for 'err' only - NOTE: we'll change this to
 *            always return this in the near future)
 * }
 */
module.exports = (pDirOrFile, pOptions) =>
    extract(
        pDirOrFile,
        pOptions,
        TYPE2REPORTER[pOptions.outputType]
    );

/* eslint no-process-exit: 0 */
