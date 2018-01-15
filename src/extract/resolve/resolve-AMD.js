"use strict";

const fs                       = require('fs');
const path                     = require('path').posix;
const resolve                  = require('resolve');
const memoize                  = require('lodash/memoize');
const pathToPosix              = require('../../utl/pathToPosix');
const determineDependencyTypes = require('./determineDependencyTypes');
const readPackageDeps          = require('./readPackageDeps');
const localNpmHelpers          = require('./localNpmHelpers');

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
    const lProbablePath = path.relative(
        pathToPosix(pBaseDir),
        path.join(pathToPosix(pFileDir), `${pModuleName}.js`)
    );
    const lDependency = {
        resolved: fileExists(lProbablePath) ? lProbablePath : pModuleName,
        coreModule: Boolean(resolve.isCore(pModuleName)),
        followable: fileExists(lProbablePath),
        couldNotResolve: !Boolean(resolve.isCore(pModuleName)) && !fileExists(lProbablePath)
    };

    const lLicense = localNpmHelpers.getLicense(pModuleName, pBaseDir);

    if (Boolean(lLicense)) {
        lDependency.license = lLicense;
    }

    return Object.assign(
        lDependency,
        {
            dependencyTypes: determineDependencyTypes(
                lDependency,
                pModuleName,
                readPackageDeps(pBaseDir),
                pFileDir
            )
        }
    );
};
