const fs                       = require('fs');
const path                     = require('path');
const isCore                   = require('resolve').isCore;
const memoize                  = require('lodash/memoize');
const pathToPosix              = require('../utl/pathToPosix');
const determineDependencyTypes = require('./determineDependencyTypes');
const readPackageDeps          = require('./readPackageDeps');
const resolveHelpers           = require('./resolve-helpers');

const fileExists = memoize(pFile => {
    try {
        fs.accessSync(pFile, fs.R_OK);
    } catch (e) {
        return false;
    }

    return true;
});

module.exports = (pModuleName, pBaseDir, pFileDir, pResolveOptions) => {
    // lookups:
    // - [x] could be relative in the end (implemented)
    // - [ ] require.config kerfuffle (command line, html, file, ...)
    // - [ ] maybe use mrjoelkemp/module-lookup-amd ?
    // - [ ] or https://github.com/jaredhanson/amd-resolve ?
    // - [x] funky plugins (json!wappie, ./screeching-cat!sabertooth) -> fixed in 'extract'
    const lProbablePath = pathToPosix(
        path.relative(
            pBaseDir,
            path.join(pFileDir, `${pModuleName}.js`)
        )
    );
    let lRetval = {
        resolved: fileExists(lProbablePath) ? lProbablePath : pModuleName,
        coreModule: Boolean(isCore(pModuleName)),
        followable: fileExists(lProbablePath),
        couldNotResolve: !Boolean(isCore(pModuleName)) && !fileExists(lProbablePath)
    };

    return Object.assign(
        lRetval,
        // we might want to use resolve options instead of {} here
        resolveHelpers.addLicenseAttribute(pModuleName, pBaseDir, {}),
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
