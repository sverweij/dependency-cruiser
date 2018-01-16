"use strict";
const path   = require('path');
const semver = require('semver');

/**
 * returns the (resolved) module identified by pModuleName:
 * - if it is available, and
 * - it satisfies the semantic version range specified by pSemVer
 *
 * returns false in all other cases
 *
 * @param  {string} pModuleName the name of the module to resolve
 * @param  {string} pSemVer     (optional) a semantic version (range)
 * @return {object}             the (resolved) module identified by pModuleName
 *                              or false
 */
module.exports = (pModuleName, pSemVer) => {
    let lRetval = false;

    try {
        lRetval = require(pModuleName);
        if (
            Boolean(pSemVer) &&
            !semver.satisfies(
                require(path.join(pModuleName, 'package.json')).version,
                pSemVer
            )
        ) {
            lRetval = false;
        }
    } catch (e) {
        lRetval = false;
    }
    return lRetval;
};

/*
  eslint
    global-require: 0,
    security/detect-non-literal-require: 0
    import/no-dynamic-require: 0
 */
