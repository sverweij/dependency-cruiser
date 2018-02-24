"use strict";

const path = require('path');
const fs   = require('fs');
const _memoize = require('lodash/memoize');

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
module.exports = readPackageDeps;
