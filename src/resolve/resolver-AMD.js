"use strict";

const path    = require('path');
const resolve = require('resolve');
const utl     = require('../utl');

function resolveAMDModule(pModuleName, pBaseDir, pFileDir) {
    // lookups:
    // - [x] could be relative in the end (implemented)
    // - [ ] require.config kerfuffle (command line, html, file, ...)
    // - [ ] maybe use mrjoelkemp/module-lookup-amd ?
    // - [ ] or https://github.com/jaredhanson/amd-resolve ?
    // - [ ] funky plugins (json!wappie, ./screeching-cat!sabertooth)
    const lProbablePath = path.relative(
        pBaseDir,
        path.join(pFileDir, `${pModuleName}.js`)
    );

    return {
        resolved: utl.fileExists(lProbablePath) ? lProbablePath : pModuleName,
        coreModule: Boolean(resolve.isCore(pModuleName)),
        followable: utl.fileExists(lProbablePath),
        couldNotResolve: !Boolean(resolve.isCore(pModuleName)) && !utl.fileExists(lProbablePath)
    };
}

module.exports = resolveAMDModule;
