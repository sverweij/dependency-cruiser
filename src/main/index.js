"use strict";

const extract      = require("../extract");
const meta         = require("../extract/transpile/meta");
const readRuleSet  = require("../validate/readRuleSet");
const reportHtml   = require("../report/htmlReporter");
const reportJson   = require("../report/jsonReporter");
const reportDot    = require("../report/dotReporter");
const reportCsv    = require("../report/csvReporter");
const reportErr    = require("../report/errReporter");
const reportVis    = require("../report/visReporter");

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
 *  ruleSet    : An object (or JSON string) containing the rules to validate
 *               against. The rules should adhere to the
 *               [ruleset schema](../src/extract/validate/jsonschema.json)
 *               The function with throw an Error when either
 *               - the passed ruleSet violates that schema or
 *               - it contains an 'unsafe' (= potentially super slow running)
 *                 regular expression.
 *  exclude    : regular expression describing which dependencies the function
 *               should not cruise
 *  system     : an array of module systems to use for following dependencies;
 *               defaults to ["es6", "cjs", "amd"]
 *  outputType : one of "json", "html", "dot", "csv", "err" or "vis". When left
 *               out the function will return a javascript object as dependencies
 * }
 *
 * @param  {array}  pFileDirArray An array of (names of) files and directories to
 *                             start the cruise with
 * @param  {object} pOptions   see above
 * @return {object} An object with ...
 * {
 *  dependencies : when outputType is defined: a string containing the dependencies
 *            in the format specified in outputType
 *            In all other cases: a javascript array with the dependencies
 *  summary    : a summary of the violations found in the dependencies:
 *              {
 *                violations: each violation;
 *                   from: the resolved 'from'
 *                   to: the resolved 'to'
 *                   rule: the violated rule, which consists of a
 *                       name: the (short) name of the rule
 *                       severity: the severetiy of the violation (error, warn or info)
 *                error : the number of errors,
 *                warn  : the number of warnings,
 *                info  : the number of informational messages
 *              }
 */
exports.cruise = (pFileDirArray, pOptions) => {
    pOptions = pOptions ? pOptions : {};

    if (Boolean(pOptions.ruleSet)){
        pOptions.ruleSet = readRuleSet(pOptions.ruleSet);
    }

    return extract(
        pFileDirArray,
        pOptions,
        TYPE2REPORTER[pOptions.outputType]
    );
};


exports.allExtensions = meta.allExtensions;

exports.getAvailableTranspilers = meta.getAvailableTranspilers;