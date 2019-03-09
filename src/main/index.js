const extract                 = require("../extract");
const meta                    = require("../extract/transpile/meta");
const reportHtml              = require("../report/html");
const reportJson              = require("../report/json");
const reportDot               = require("../report/dot/moduleLevel")();
const reportDDot              = require("../report/dot/folderLevel");
const RCScheme                = require('../report/dot/common/richModuleColorScheme.json');
const reportRCDot             = require("../report/dot/moduleLevel")(RCScheme);
const reportCsv               = require("../report/csv");
const reportErr               = require("../report/err");
const normalizeFilesAndDirs   = require("./filesAndDirs/normalize");
const validateRuleSet         = require("./ruleSet/validate");
const normalizeRuleSet        = require("./ruleSet/normalize");
const validateOptions         = require("./options/validate");
const normalizeOptions        = require("./options/normalize");
const normalizeResolveOptions = require("./resolveOptions/normalize");

const TYPE2REPORTER      = {
    "json"  : reportJson,
    "html"  : reportHtml,
    "dot"   : reportDot,
    "ddot"  : reportDDot,
    "rcdot" : reportRCDot,
    "csv"   : reportCsv,
    "err"   : reportErr
};

/**
 * Cruises through and returns the dependencies in a directory, or
 * starting with a file. Supports javascript (ES2015 and older), typescript
 * and coffeescript.
 *
 * The options influence how the function returns the dependencies.
 * {
 *  validate    : if true, will attempt to validate with the rules in rulesFile.
 *                Default false.
 *  ruleSet     : An object containing the rules to validate
 *                against. The rules should adhere to the
 *                [ruleset schema](../src/main/ruleSet/jsonschema.json)
 *                The function with throw an Error when either
 *                - the passed ruleSet violates that schema or
 *                - it contains an 'unsafe' (= potentially super slow running)
 *                  regular expression.
 *  doNotFollow : regular expression describing which dependencies the function
 *                should cruise, but not resolve or follow any further
 *                OR
 *                an object of the following shape:
 *                path: a regular expression as above
 *                dependencyTypes: an array of dependency types
 *  exclude     : regular expression describing which dependencies the function
 *                should not cruise
 *  maxDepth    : the maximum depth to cruise; 0 <= n <= 99
 *                (default: 0, which means 'infinite depth')
 *  moduleSystems: an array of module systems to use for following dependencies;
 *                defaults to ["es6", "cjs", "amd"]
 *  outputType  : one of "json", "html", "dot", "rcdot", "csv" or "err". When left
 *                out the function will return a javascript object as dependencies
 *  preserveSymlinks: if true does not resolve symlinks, defaults to false
 * }
 *
 * @param  {array}  pFileDirArray An array of (names of) files and directories to
 *                                start the cruise with
 * @param  {any} pOptions         see above
 * @param  {any} pResolveOptions  an object with enhanced-resolve resolve options
 * @param  {any} pTSConfig        an object with tsconfig ('typescript project') options
 *                                ('flattened' so there's no need for file access on any
 *                                'extends' option in there)
 * @return {any} An object with ...
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
function cruise (pFileDirArray, pOptions, pResolveOptions, pTSConfig) {
    pOptions = normalizeOptions(
        validateOptions(pOptions)
    );

    if (Boolean(pOptions.ruleSet)){
        pOptions.ruleSet = normalizeRuleSet(
            validateRuleSet(
                pOptions.ruleSet
            )
        );
    }

    return extract(
        normalizeFilesAndDirs(pFileDirArray),
        pOptions,
        TYPE2REPORTER[pOptions.outputType],
        normalizeResolveOptions(pResolveOptions, pOptions),
        pTSConfig
    );
}

module.exports = {
    cruise,
    allExtensions: meta.allExtensions,
    getAvailableTranspilers: meta.getAvailableTranspilers
};
