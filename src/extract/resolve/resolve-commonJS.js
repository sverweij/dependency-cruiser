"use strict";

const path                     = require('path');
const resolve                  = require('resolve');
const pathToPosix              = require('../../utl/pathToPosix');
const transpileMeta            = require('../transpile/meta');
const determineDependencyTypes = require('./determineDependencyTypes');
const readPackageDeps          = require('./readPackageDeps');
const resolveHelpers           = require('./resolve-helpers');

const SUPPORTED_EXTENSIONS = transpileMeta.scannableExtensions;

function addResolutionAttributes(pBaseDir, pModuleName, pFileDir) {
    let lRetval = {};

    if (resolve.isCore(pModuleName)){
        lRetval.coreModule = true;
    } else {
        try {
            lRetval.resolved = pathToPosix(
                path.relative(
                    pBaseDir,
                    resolve.sync(
                        pModuleName, {
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
    return lRetval;
}

/*
 * resolves both CommonJS and ES6
 */
module.exports = (pModuleName, pBaseDir, pFileDir) => {
    let lRetval = Object.assign(
        {
            resolved        : pModuleName,
            coreModule      : false,
            followable      : false,
            couldNotResolve : false,
            dependencyTypes : ["undetermined"]
        },
        addResolutionAttributes(pBaseDir, pModuleName, pFileDir)
    );

    return Object.assign(
        lRetval,
        resolveHelpers.addLicenseAttribute(pModuleName, pBaseDir),
        {
            dependencyTypes: determineDependencyTypes(
                lRetval,
                pModuleName,
                readPackageDeps(pFileDir),
                pFileDir
            )
        }
    );
};
