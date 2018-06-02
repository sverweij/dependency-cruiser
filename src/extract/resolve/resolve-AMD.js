"use strict";

const fs                       = require('fs');
const path                     = require('path');
const resolve                  = require('resolve');
const memoize                  = require('lodash/memoize');
const pathToPosix              = require('../../utl/pathToPosix');
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

module.exports = (pModuleName, pBaseDir, pFileDir) => {
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
        coreModule: Boolean(resolve.isCore(pModuleName)),
        followable: fileExists(lProbablePath),
        couldNotResolve: !Boolean(resolve.isCore(pModuleName)) && !fileExists(lProbablePath)
    };

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
