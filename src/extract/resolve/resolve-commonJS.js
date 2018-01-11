"use strict";

const path                     = require('path').posix;
const resolve                  = require('resolve');
const transpileMeta            = require('../transpile/meta');
const determineDependencyTypes = require('./determineDependencyTypes');
const readPackageDeps          = require('./readPackageDeps');
const localNpmHelpers          = require('./localNpmHelpers');
const pathToPosix              = require('./pathToPosix');

const SUPPORTED_EXTENSIONS = transpileMeta.scannableExtensions;

/*
 * resolves both CommonJS and ES6
 */
module.exports = (pModuleName, pBaseDir, pFileDir) => {
    let lRetval = {
        resolved        : pModuleName,
        coreModule      : false,
        followable      : false,
        couldNotResolve : false,
        dependencyTypes : ["undetermined"]
    };

    if (resolve.isCore(pModuleName)){
        lRetval.coreModule = true;
    } else {
        try {
            lRetval.resolved = path.relative(
                pathToPosix(pBaseDir),
                pathToPosix(
                    resolve.sync(
                        pModuleName,
                        {
                            basedir: pathToPosix(pFileDir),
                            extensions: SUPPORTED_EXTENSIONS
                        }
                    )
                )
            );
            lRetval.followable = (path.extname(lRetval.resolved) !== ".json");
        } catch (e) {
            lRetval.couldNotResolve = true;
        }
    }

    const lLicense = localNpmHelpers.getLicense(pModuleName, pBaseDir);

    if (Boolean(lLicense)) {
        lRetval.license = lLicense;
    }

    return Object.assign(
        lRetval,
        {
            dependencyTypes: determineDependencyTypes(
                lRetval,
                pModuleName,
                readPackageDeps(pBaseDir),
                pFileDir
            )
        }
    );
};
