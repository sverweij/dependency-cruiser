const glob                    = require('glob');
const _get                    = require('lodash/get');
const main                    = require('../main');
const parseTSConfig           = require('./parseTSConfig');
const getResolveConfig        = require('./getResolveConfig');
const validateFileExistence   = require('./utl/validateFileExistence');
const normalizeOptions        = require('./normalizeOptions');
const initConfig               = require('./initConfig');
const io                      = require('./utl/io');
const formatMetaInfo          = require('./formatMetaInfo');

function extractResolveOptions(pOptions) {
    let lResolveOptions = {};
    const lWebPackConfigFileName = _get(pOptions, 'ruleSet.options.webpackConfig.fileName', null);

    if (lWebPackConfigFileName) {
        lResolveOptions = getResolveConfig(
            lWebPackConfigFileName,
            _get(pOptions, 'ruleSet.options.webpackConfig.env', null),
            _get(pOptions, 'ruleSet.options.webpackConfig.arguments', null)
        );
    }
    return lResolveOptions;
}

function extractTSConfigOptions(pOptions) {
    let lRetval = {};
    const lTSConfigFileName = _get(pOptions, "ruleSet.options.tsConfig.fileName", null);

    if (lTSConfigFileName) {
        lRetval = parseTSConfig(lTSConfigFileName);
    }

    return lRetval;
}

function runCruise(pFileDirArray, pOptions) {
    let lExitCode = 0;

    pFileDirArray
        .filter(pFileOrDir => !glob.hasMagic(pFileOrDir))
        .forEach(validateFileExistence);

    pOptions = normalizeOptions(pOptions);

    const lDependencyList = main.cruise(
        pFileDirArray,
        pOptions,
        extractResolveOptions(pOptions),
        extractTSConfigOptions(pOptions)
    );

    io.write(pOptions.outputTo, lDependencyList.modules);

    if (lDependencyList.summary.error > 0 && pOptions.outputType === "err") {
        lExitCode = lDependencyList.summary.error;
    }
    return lExitCode;
}

module.exports = (pFileDirArray, pOptions) => {
    pOptions = pOptions || {};
    let lExitCode = 0;

    try {
        if (pOptions.info === true) {
            process.stdout.write(formatMetaInfo());
        } else if (pOptions.init){
            initConfig(pOptions.init);
        } else {
            lExitCode = runCruise(pFileDirArray, pOptions);
        }
    } catch (e) {
        process.stderr.write(`\n  ERROR: ${e.message}\n`);
        lExitCode = 1;
    }
    return lExitCode;
};
