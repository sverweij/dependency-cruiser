"use strict";

const path    = require('path');
const resolve = require('resolve');
const transpileMeta = require('../transpile/meta');

const SUPPORTED_EXTENSIONS = transpileMeta.scannableExtensions;

/*
 * resolves both CommonJS and ES6
 */
module.exports = (pModuleName, pBaseDir, pFileDir) => {
    let lRetval = {
        resolved        : pModuleName,
        coreModule      : false,
        followable      : false,
        couldNotResolve : false
    };

    if (resolve.isCore(pModuleName)){
        lRetval.coreModule = true;
    } else {
        try {
            lRetval.resolved = path.relative(
                pBaseDir,
                resolve.sync(
                    pModuleName,
                    {
                        basedir: pFileDir,
                        extensions: SUPPORTED_EXTENSIONS
                    }
                )
            );
            lRetval.followable = (path.extname(lRetval.resolved) !== ".json");
        } catch (e) {
            lRetval.couldNotResolve = true;
        }
    }
    return lRetval;
};
