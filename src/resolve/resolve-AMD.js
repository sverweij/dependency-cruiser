"use strict";

const path                     = require('path');
const resolve                  = require('resolve');
const utl                      = require('../utl');
const determineDependencyTypes = require("./determineDependencyTypes");
const readPackageDeps          = require('./readPackageDeps');

module.exports = (pModuleName, pBaseDir, pFileDir) => {
    // lookups:
    // - [x] could be relative in the end (implemented)
    // - [ ] require.config kerfuffle (command line, html, file, ...)
    // - [ ] maybe use mrjoelkemp/module-lookup-amd ?
    // - [ ] or https://github.com/jaredhanson/amd-resolve ?
    // - [x] funky plugins (json!wappie, ./screeching-cat!sabertooth) -> fixed in 'extract'
    const lProbablePath = path.relative(
        pBaseDir,
        path.join(pFileDir, `${pModuleName}.js`)
    );
    const lDependency = {
        resolved: utl.fileExists(lProbablePath) ? lProbablePath : pModuleName,
        coreModule: Boolean(resolve.isCore(pModuleName)),
        followable: utl.fileExists(lProbablePath),
        couldNotResolve: !Boolean(resolve.isCore(pModuleName)) && !utl.fileExists(lProbablePath)
    };

    return Object.assign(
        lDependency,
        {
            dependencyTypes: determineDependencyTypes(
                lDependency,
                pModuleName,
                readPackageDeps(pBaseDir)
            )
        }
    );
};
