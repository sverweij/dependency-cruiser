"use strict";

const fs               = require('fs');
const path             = require('path');
const pathToPosix      = require('../../utl/pathToPosix');
const resolveAMDModule = require('./resolve-AMD');
const resolveCJSModule = require('./resolve-commonJS');

const isRelativeModuleName = pString => pString.startsWith(".");

function resolveModule(pDependency, pBaseDir, pFileDir) {
    let lRetval = null;

    if (isRelativeModuleName(pDependency.moduleName)) {
        lRetval = resolveCJSModule(pDependency.moduleName, pBaseDir, pFileDir);
    } else if (["cjs", "es6"].indexOf(pDependency.moduleSystem) > -1) {
        lRetval = resolveCJSModule(pDependency.moduleName, pBaseDir, pFileDir);
    } else {
        lRetval = resolveAMDModule(pDependency.moduleName, pBaseDir, pFileDir);
    }
    return lRetval;
}

/**
 * resolves the module name of the pDependency to a file on disk.
 *
 * @param  {object} pDependency an object with a moduleName and the moduleSystem
 *                              according to which this is a dependency
 * @param  {string} pBaseDir    the directory to consider as base (or 'root')
 *                              for resolved files.
 * @param  {string} pFileDir    the directory of the file the dependency was
 *                              detected in
 * @param  {boolean} pPreserveSymlinks whether to use `fs.realpath` to resolve symlinks
 * @return {object}             an object with as attributes:
 *                              - resolved: a string representing the pDependency
 *                                  resolved to a file on disk (or the pDependency
 *                                  name itself when it could not be resolved)
 *                              - coreModule: true the dependency is a (node)
 *                                  core module - false in all other cases
 *                                  (deprecated over dependencyType === 'core')
 *                              - followable: true when it is worthwhile to
 *                                  follow dependencies of this dependency (
 *                                  typically not true for .json)
 *                              - couldNotResolve: true if it was not possible
 *                                  to resolve the dependency to a file on disk
 *                              - dependencyTypes: an array of dependencyTypes
 *
 */
module.exports = (pDependency, pBaseDir, pFileDir, pPreserveSymlinks) => {
    let lResolvedModule = resolveModule(pDependency, pBaseDir, pFileDir);

    if (!pPreserveSymlinks && !lResolvedModule.coreModule && !lResolvedModule.couldNotResolve) {
        try {
            lResolvedModule.resolved =
                pathToPosix(path.relative(pBaseDir, fs.realpathSync(path.resolve(pBaseDir, lResolvedModule.resolved))));
        } catch (e) {
            lResolvedModule.couldNotResolve = true;
        }
    }
    return lResolvedModule;
};


