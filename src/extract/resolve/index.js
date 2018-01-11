"use strict";

const path             = require('path');
const resolveAMDModule = require('./resolve-AMD');
const resolveCJSModule = require('./resolve-commonJS');

const isRelativeModuleName = pString => pString.startsWith(".");

const ensurePosix = (pFilePath) => {
    if (path.sep !== path.posix.sep) {
        return pFilePath.split(path.sep).join(path.posix.sep);
    }

    return pFilePath;
};

/**
 * resolves the module name of the pDependency to a file on disk.
 *
 * @param  {object} pDependency an object with a moduleName and the moduleSystem
 *                              according to which this is a dependency
 * @param  {string} pBaseDir    the directory to consider as base (or 'root')
 *                              for resolved files.
 * @param  {string} pFileDir    the directory of the file the dependency was
 *                              detected in
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
module.exports = (pDependency, pBaseDir, pFileDir) => {
    if (isRelativeModuleName(pDependency.moduleName)){
        return ensurePosix(resolveCJSModule(pDependency.moduleName, pBaseDir, pFileDir));
    } else if (["cjs", "es6"].indexOf(pDependency.moduleSystem) > -1){
        return ensurePosix(resolveCJSModule(pDependency.moduleName, pBaseDir, pFileDir));
    } else {
        return ensurePosix(resolveAMDModule(pDependency.moduleName, pBaseDir, pFileDir));
    }
};
