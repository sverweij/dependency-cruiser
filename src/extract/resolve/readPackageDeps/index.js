const path          = require('path');
const fs            = require('fs');
const _memoize      = require('lodash/memoize');
const mergePackages = require('./mergePackages');

/**
 * return the contents of the package.json closest to the passed
 * folder (or null if there's no such package.json/ that package.json
 * is invalid).
 *
 * This behavior is consistent with node's lookup mechanism
 *
 * @param {string} pFileDir the folder relative to which to find
 *                          the package.json
 * @return {any} the contents of the package.json as a javascript
 *               object or null if the package.json could not be
 *               found or is invalid
 */
const readPackageDeps = _memoize((pFileDir) => {
    let lRetval = null;

    try {
        // find the closest package.json from pFileDir
        const lPackageContent = fs.readFileSync(path.join(pFileDir, 'package.json'), 'utf8');

        try {
            lRetval = JSON.parse(lPackageContent);
        } catch (e) {
            // left empty on purpose
        }
    } catch (e) {
        const lNextDir = path.dirname(pFileDir);

        if (lNextDir !== pFileDir) {
            // not yet reached root directory
            lRetval = readPackageDeps(lNextDir);
        }
    }
    return lRetval;
});

function maybeReadPackage(pFileDir) {
    let lRetval = {};

    try {
        const lPackageContent = fs.readFileSync(path.join(pFileDir, 'package.json'), 'utf8');

        try {
            lRetval = JSON.parse(lPackageContent);
        } catch (e) {
            // left empty on purpose
        }
    } catch (e) {
        // left empty on purpose
    }
    return lRetval;
}

function getIntermediatePaths(pFileDir, pBaseDir) {
    let lRetval = [];
    let lIntermediate = pFileDir;

    while (
        lIntermediate !== pBaseDir &&
        // safety hatch in case pBaseDir is either not a part of
        // pFileDir or not something uniquely comparable to a
        // dirname
        lIntermediate !== path.dirname(lIntermediate)
    ) {
        lRetval.push(lIntermediate);
        lIntermediate = path.dirname(lIntermediate);
    }
    lRetval.push(pBaseDir);
    return lRetval;
}

// despite the two parameters there's no resolver function provided
// to the _.memoize. This is deliberate - the pBaseDir will typically
// be the same for each call in a typical cruise, so the lodash'
// default memoize resolver (the first param) will suffice.
const readPackageDepsCombined = _memoize((pFileDir, pBaseDir) => {
    // The way this is called, this shouldn't happen. If it is, there's
    // something gone terribly awry
    if (!pFileDir.startsWith(pBaseDir) || pBaseDir.endsWith(path.sep)) {
        throw new Error(
            `Unexpected Error: Unusal baseDir passed to package reading function: '${pBaseDir}'\n` +
            `Please file a bug: https://github.com/sverweij/dependency-cruiser/issues/new?template=bug-report.md` +
            `&title=Unexpected Error: Unusal baseDir passed to package reading function: '${pBaseDir}'`
        );
    }

    const lRetval = getIntermediatePaths(pFileDir, pBaseDir)
        .reduce(
            (pAll, pCurrent) => mergePackages(pAll, maybeReadPackage(pCurrent)),
            {}
        );

    return Object.keys(lRetval).length > 0 ? lRetval : null;
});


/**
 * return
 * - the contents of the package.json closest to the passed folder
 *   (see readPackageDeps above)  when pCombinedDependencies === false
 * - the 'combined' contents of all package.jsons between the passed folder
 *   and the 'root' folder (the folder the cruise was run from) in
 *   all other cases
 * @param  {string}  pFileDir              the folder relative to which to find
 *                                         the (closest) package.json
 * @param  {string}  pBaseDir              the directory to consider as base (or 'root')
 * @param  {Boolean} pCombinedDependencies whether to stop (false) or continue
 *                                         searching until the 'root'
 * @return {any}                           the contents of a package.json as a javascript
 *                                         object or null if a package.json could not be
 *                                        found or is invalid
 */
module.exports = (pFileDir, pBaseDir, pCombinedDependencies = false) => {
    if (pCombinedDependencies) {
        return readPackageDepsCombined(pFileDir, pBaseDir);
    } else {
        return readPackageDeps(pFileDir);
    }

};
