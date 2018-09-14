const path       = require('path');
const tryRequire = require('semver-try-require');
const _get       = require('lodash/get');
const $package   = require('../../package.json');

const typescript = tryRequire('typescript', _get($package, 'supportedTranspilers.typescript', null));

const formatDiagnosticsHost = {
    getCanonicalFileName(pFileName) {
        let lRetval = pFileName.toLowerCase();

        /* istanbul ignore next - depends on the platform which branch is taken */
        if (_get(typescript, 'sys.useCaseSensitiveFileNames', false)){
            lRetval = pFileName;
        }
        return lRetval;
    },
    getCurrentDirectory() {
        return process.cwd();
    },
    getNewLine() {
        return '\n';
    }
};

module.exports = function parseConfig(pTSConfigFileName) {
    let lRetval = {};

    /* istanbul ignore else */
    if (typescript) {
        const lConfig = typescript.readConfigFile(pTSConfigFileName, typescript.sys.readFile);

        if (typeof lConfig.error !== 'undefined') {
            throw new Error(typescript.formatDiagnostics([lConfig.error], formatDiagnosticsHost));
        }
        lRetval = typescript.parseJsonConfigFileContent(
            lConfig.config,
            typescript.sys,
            path.dirname(pTSConfigFileName),
            {},
            pTSConfigFileName
        );

        if (lRetval.errors.length !== 0) {
            throw new Error(typescript.formatDiagnostics(lRetval.errors, formatDiagnosticsHost));
        }
        // lRetval.fileNames; // all files included in the project
        // lRetval.options; // CompilerOptions
    }

    return lRetval;
};
