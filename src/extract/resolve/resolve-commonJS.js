const path                     = require('path');
const isCore                   = require('resolve').isCore;
const pathToPosix              = require('../utl/pathToPosix');
const determineDependencyTypes = require('./determineDependencyTypes');
const readPackageDeps          = require('./readPackageDeps');
const resolveHelpers           = require('./resolve-helpers');
const resolve                  = require('./resolve');
const isFollowable             = require('./isFollowable');


function addResolutionAttributes(pBaseDir, pModuleName, pFileDir, pResolveOptions) {
    let lRetval = {};

    if (isCore(pModuleName)){
        lRetval.coreModule = true;
    } else {
        try {
            lRetval.resolved = pathToPosix(
                path.relative(
                    pBaseDir,
                    resolve(pModuleName, pFileDir, pResolveOptions)
                )
            );
            lRetval.followable = isFollowable(lRetval.resolved, pResolveOptions);
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
        resolveHelpers.addLicenseAttribute(pModuleName, pBaseDir, pResolveOptions),
        {
            dependencyTypes: determineDependencyTypes(
                lRetval,
                pModuleName,
                readPackageDeps(pFileDir, pBaseDir, pResolveOptions.combinedDependencies),
                pFileDir,
                pResolveOptions,
                pBaseDir
            )
        }
    );
};
