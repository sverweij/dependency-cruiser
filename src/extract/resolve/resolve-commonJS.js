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

let gResolver = null;

function determineResolveOptions(pResolveOptions){
    let DEFAULT_RESOLVE_OPTIONS = {
        // we can later on make symlinks listen to the preserveSymlinks option
        // and chuck some code to manually do this in index.js
        symlinks: false
    };

    const NON_OVERRIDABLE_RESOLVE_OPTIONS = {
        fileSystem: new enhancedResolve.CachedInputFileSystem(
            new enhancedResolve.NodeJsInputFileSystem(),
            CACHE_DURATION
        ),
        extensions: transpileMeta.scannableExtensions,
        useSyncFileSystemCalls: true
    };

    return Object.assign(
        DEFAULT_RESOLVE_OPTIONS,
        pResolveOptions,
        NON_OVERRIDABLE_RESOLVE_OPTIONS
    );
}

function addResolutionAttributes(pBaseDir, pModuleName, pFileDir, pResolveOptions) {
    let lRetval = {};

    if (!gResolver || pResolveOptions.bustTheCache) {
        gResolver = enhancedResolve.ResolverFactory.createResolver(
            determineResolveOptions(pResolveOptions)
        );
    }

    if (resolve.isCore(pModuleName)){
        lRetval.coreModule = true;
    } else {
        try {
            lRetval.resolved = pathToPosix(
                path.relative(
                    pBaseDir,
                    gResolver.resolveSync(
                        {},
                        // lookupStartPath
                        pathToPosix(pFileDir),
                        // request
                        pModuleName
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
module.exports = (pModuleName, pBaseDir, pFileDir, pResolveOptions) => {

    let lRetval = Object.assign(
        {
            resolved        : pModuleName,
            coreModule      : false,
            followable      : false,
            couldNotResolve : false,
            dependencyTypes : ["undetermined"]
        },
        addResolutionAttributes(pBaseDir, pModuleName, pFileDir, pResolveOptions)
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
