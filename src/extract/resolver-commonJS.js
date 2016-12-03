"use strict";

const path    = require('path');
const resolve = require('resolve');

/*
 * resolves both CommonJS and ES6
 */
function resolveCJSModule(pModuleName, pBaseDir, pFileDir) {
    let lRetval = {
        resolved        : pModuleName,
        coreModule      : false,
        followable      : false,
        couldNotResolve : false
    };

    if (resolve.isCore(pModuleName)){
        lRetval.coreModule = true;
    } else {
        try {
            lRetval.resolved = path.relative(
                pBaseDir,
                resolve.sync(pModuleName, {basedir: pFileDir, extensions: [".js", ".ts", ".d.ts"]})
            );
            lRetval.followable = (path.extname(lRetval.resolved) !== ".json");
        } catch (e) {
            lRetval.couldNotResolve = true;
        }
    }
    return lRetval;
}

module.exports = resolveCJSModule;
