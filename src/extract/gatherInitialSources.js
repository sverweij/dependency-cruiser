const fs            = require('fs');
const path          = require('path');
const glob          = require('glob');
const transpileMeta = require('./transpile/meta');
const pathToPosix   = require('./utl/pathToPosix');

const SUPPORTED_EXTENSIONS = transpileMeta.scannableExtensions;

function matchesPattern(pFullPathToFile, pPattern) {
    return RegExp(pPattern, "g").test(pFullPathToFile);
}

function gatherScannableFilesFromDir (pDirName, pOptions) {
    return fs.readdirSync(pDirName)
        .reduce((pSum, pFileName) => {
            if (fs.statSync(path.join(pDirName, pFileName)).isDirectory()){
                return pSum.concat(gatherScannableFilesFromDir(path.join(pDirName, pFileName), pOptions));
            }
            if (SUPPORTED_EXTENSIONS.some(pExt => pFileName.endsWith(pExt))){
                return pSum.concat(path.join(pDirName, pFileName));
            }
            return pSum;
        }, [])
        .filter(
            pFullPathToFile =>
                (!pOptions.exclude || !matchesPattern(pathToPosix(pFullPathToFile), pOptions.exclude)) &&
                (!pOptions.includeOnly || matchesPattern(pathToPosix(pFullPathToFile), pOptions.includeOnly))
        );
}

/**
 * Returns an array of strings, representing paths to files to be gathered
 *
 * If an entry in the array passed is a (path to a) directory, it recursively
 * scans that directory for files with a scannable extension.
 * If an entry is a path to a file it just adds it.
 *
 * Files and directories are assumed to be either absolute, or relative to the
 * current working directory.
 *
 * @param  {array} pFileDirArray an array of strings, representing globs and/ or
 *                               paths to files or directories to be gathered
 * @param  {object} pOptions     (optional) object with attributes
 *                               - exclude - regexp of what to exclude
 *                               - includeOnly - regexp what to exclude
 * @return {array}               an array of strings, representing paths to
 *                               files to be gathered.
 */
module.exports = (pFileDirArray, pOptions) => {
    const lOptions = Object.assign({baseDir: process.cwd()}, pOptions);

    return pFileDirArray
        .reduce(
            (pAll, pThis) => pAll.concat(glob.sync(pThis, {cwd:lOptions.baseDir})),
            []
        )
        .reduce(
            (pAll, pThis) => {
                if (fs.statSync(path.join(lOptions.baseDir, pThis)).isDirectory()) {
                    return pAll.concat(gatherScannableFilesFromDir(pThis, lOptions));
                } else {
                    return pAll.concat(pThis);
                }
            },
            []
        );
};
