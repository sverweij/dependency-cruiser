const fs = require("fs");
const path = require("path");
const pathToPosix = require("../../utl/path-to-posix");
const isRelativeModuleName = require("./is-relative-module-name");
const resolveAMD = require("./resolve-amd");
const resolveCommonJS = require("./resolve-cjs");

function resolveModule(
  pDependency,
  pBaseDirectory,
  pFileDirectory,
  pResolveOptions
) {
  let lReturnValue = null;

  if (
    isRelativeModuleName(pDependency.module) ||
    ["cjs", "es6"].includes(pDependency.moduleSystem)
  ) {
    lReturnValue = resolveCommonJS(
      pDependency.module,
      pBaseDirectory,
      pFileDirectory,
      pResolveOptions
    );
  } else {
    lReturnValue = resolveAMD(
      pDependency.module,
      pBaseDirectory,
      pFileDirectory,
      pResolveOptions
    );
  }
  return lReturnValue;
}

/**
 * resolves the module name of the pDependency to a file on disk.
 *
 * @param  {object} pDependency an object with a module and the moduleSystem
 *                              according to which this is a dependency
 * @param  {string} pBaseDirectory    the directory to consider as base (or 'root')
 *                              for resolved files.
 * @param  {string} pFileDirectory    the directory of the file the dependency was
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
module.exports = (
  pDependency,
  pBaseDirectory,
  pFileDirectory,
  pResolveOptions
) => {
  let lResolvedModule = resolveModule(
    pDependency,
    pBaseDirectory,
    pFileDirectory,
    pResolveOptions
  );

  if (
    !pResolveOptions.symlinks &&
    !lResolvedModule.coreModule &&
    !lResolvedModule.couldNotResolve
  ) {
    try {
      lResolvedModule.resolved = pathToPosix(
        path.relative(
          pBaseDirectory,
          fs.realpathSync(
            path.resolve(pBaseDirectory, lResolvedModule.resolved)
          )
        )
      );
    } catch (pError) {
      lResolvedModule.couldNotResolve = true;
    }
  }
  return lResolvedModule;
};
