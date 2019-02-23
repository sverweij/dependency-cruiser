const fs               = require('fs');
const path             = require('path');
const pathToPosix      = require('../utl/pathToPosix');
const resolveAMD       = require('./resolve-AMD');
const resolveCommonJS  = require('./resolve-commonJS');

const isRelativeModuleName = pString => pString.startsWith(".");

function resolveModule(pDependency, pBaseDir, pFileDir, pResolveOptions) {
    let lRetval = null;

    if (
        isRelativeModuleName(pDependency.moduleName) ||
        ["cjs", "es6"].indexOf(pDependency.moduleSystem) > -1
    ) {
        lRetval = resolveCommonJS(pDependency.moduleName, pBaseDir, pFileDir, pResolveOptions);
    } else {
        lRetval = resolveAMD(pDependency.moduleName, pBaseDir, pFileDir, pResolveOptions);
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
 * @param  {object} pResolveOptions an object with options to pass to the resolver
 *                              see https://github.com/webpack/enhanced-resolve#resolver-options
 *                              for a complete list
 *                              (also supports the attribute `bustTheCache`. Without
 *                              that attribute (or with the value `false`) the resolver
 *                              is initialized only once per session. If the attribute
 *                              equals `true` the resolver is initialized on each call
 *                              (which is slower, but might is useful in some situations,
 *                              like in executing unit tests that verify if different
 *                              passed options yield different results))
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
module.exports = (pDependency, pBaseDir, pFileDir, pResolveOptions) => {
    let lResolvedModule = resolveModule(pDependency, pBaseDir, pFileDir, pResolveOptions);

    if (!(pResolveOptions.symlinks) && !lResolvedModule.coreModule && !lResolvedModule.couldNotResolve) {
        try {
            lResolvedModule.resolved =
                pathToPosix(path.relative(pBaseDir, fs.realpathSync(path.resolve(pBaseDir, lResolvedModule.resolved))));
        } catch (e) {
            lResolvedModule.couldNotResolve = true;
        }
    }
    return lResolvedModule;
};
