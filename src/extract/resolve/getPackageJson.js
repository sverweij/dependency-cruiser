"use strict";

const fs      = require('fs');
const path    = require('path');
const resolve = require('resolve');

/**
 * returns the contents of the package.json of the given pModule as it would
 * resolve from pBaseDir
 *
 * e.g. to get the package.json of `lodash` that is required bya
 * `src/report/something.js` use `getPackageJSON('lodash', 'src/report/');`
 *
 * The pBaseDir parameter is necessary because dependency-cruiser/ this module
 * will have a different base dir, and will hence resolve either to the
 * wrong package or not to a package at all.
 *
 * @param  {string} pModule  The module to get the package.json of
 * @param  {string} pBaseDir The base dir. Defaults to '.'
 * @return {object}          The package.json as a javascript object, or
 *                           null if either module or package.json could
 *                           not be found
 */
module.exports = (pModule, pBaseDir) => {
    let lRetval = null;

    try {
        let lPackageJsonFilename = resolve.sync(
            path.join(pModule.split("/")[0], "package.json"),
            {
                basedir: pBaseDir ? pBaseDir : "."
            }
        );

        lRetval = JSON.parse(
            fs.readFileSync(lPackageJsonFilename, 'utf8')
        );

    } catch (e) {
        // left empty on purpose
    }
    return lRetval;
};
