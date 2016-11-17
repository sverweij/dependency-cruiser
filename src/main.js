const fs              = require("fs");
const _               = require("lodash");
const safeRegex       = require('safe-regex');

const utl             = require("./utl");
const extractor       = require("./extractor-composite");

const DEFAULT_MODULE_SYSTEMS    = ["cjs", "amd", "es6"];
const MODULE_SYSTEM_LIST_RE     = /^((cjs|amd|es6)(,|$))+$/gi;

function write(pOutputTo, pDependencyString) {
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

function normalizeModuleSystems(pSystemList) {
    if (_.isString(pSystemList)) {
        return _(pSystemList.split(",")).sort().uniq().valueOf();
    }
    // istanbul ignore else
    if (_.isArray(pSystemList)) {
        return _(pSystemList).sort().uniq().valueOf();
    }
    // istanbul ignore next
    return DEFAULT_MODULE_SYSTEMS;
}

function validateFileExistence(pDirOrFile) {
    if (!utl.fileExists(pDirOrFile)) {
        throw Error(`Can't open '${pDirOrFile}' for reading. Does it exist?\n`);
    }
}

function validateSystems(pSystem) {
    if (Boolean(pSystem) && _.isString(pSystem)) {
        const lParamArray = pSystem.match(MODULE_SYSTEM_LIST_RE);

        if (!lParamArray || lParamArray.length !== 1) {
            throw Error(`Invalid module system list: '${pSystem}'\n`);
        }
    }
}

function validateExcludePattern(pExclude) {
    if (Boolean(pExclude) && !safeRegex(pExclude)) {
        throw Error(
            `The exclude pattern '${pExclude}' will probably run very slowly - cowardly refusing to run.\n`
        );
    }
}

function validateParameters(pDirOrFile, pOptions) {
    validateFileExistence(pDirOrFile);
    if (Boolean(pOptions)) {
        validateSystems(pOptions.system);
        validateExcludePattern(pOptions.exclude);
    }
}

function doMagic(pDirOrFile, pOptions) {
    let lMagic = {};

    if (fs.statSync(pDirOrFile).isDirectory()) {
        lMagic = extractor.extractRecursiveDir(pDirOrFile, pOptions);
    } else {
        lMagic = extractor.extractRecursive(pDirOrFile, pOptions);
    }
    return JSON.stringify(lMagic, null, "  ");
}

exports.main = (pDirOrFile, pOptions) => {
    pOptions = _.defaults(pOptions, {
        exclude: "",
        outputTo: "-",
        system: DEFAULT_MODULE_SYSTEMS
    });

    try {
        validateParameters(pDirOrFile, pOptions);
        pOptions.moduleSystems = normalizeModuleSystems(pOptions.system);
        if ("-" === pOptions.outputTo) {
            process.stdout.write(doMagic(pDirOrFile, pOptions));
        } else {
            write(
                pOptions.outputTo,
                doMagic(pDirOrFile, pOptions)
            );
        }
    } catch (e) {
        process.stderr.write(`ERROR: ${e.message}`);
    }
};
