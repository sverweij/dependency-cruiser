"use strict";

const path                     = require('path');
const resolve                  = require('resolve');
const enhancedResolve          = require('enhanced-resolve');
const pathToPosix              = require('../../utl/pathToPosix');
const transpileMeta            = require('../transpile/meta');
const determineDependencyTypes = require('./determineDependencyTypes');
const readPackageDeps          = require('./readPackageDeps');
const resolveHelpers           = require('./resolve-helpers');

const CACHE_DURATION = 4000;

const resolver = enhancedResolve.ResolverFactory.createResolver({
    fileSystem: new enhancedResolve.CachedInputFileSystem(
        new enhancedResolve.NodeJsInputFileSystem(),
        CACHE_DURATION
    ),
    extensions: transpileMeta.scannableExtensions,
    useSyncFileSystemCalls: true,
    // we can later on make symlinks listen to the preserveSymlinks option
    // and chuck some code to manually do this in index.js
    symlinks: false
    // alias and aliasFields to address #4 will come here
});

function addResolutionAttributes(pBaseDir, pModuleName, pFileDir) {
    let lRetval = {};

    if (resolve.isCore(pModuleName)){
        lRetval.coreModule = true;
    } else {
        try {
            lRetval.resolved = pathToPosix(
                path.relative(
                    pBaseDir,
                    resolver.resolveSync(
                        // context
                        {},
                        // lookupStartPath
                        pathToPosix(pFileDir),
                        // request
                        pModuleName,
                        // resolveContext
                        {}
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
