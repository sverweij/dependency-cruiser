const fs = require("fs");
const path = require("path");
const monkeyPatchedModule = require("module");
const get = require("lodash/get");
const pathToPosix = require("../utl/path-to-posix");
const { isRelativeModuleName } = require("./module-classifiers");
const resolveAMD = require("./resolve-amd");
const resolveCommonJS = require("./resolve-cjs");
const resolveHelpers = require("./resolve-helpers");

function resolveModule(
  pModule,
  pBaseDirectory,
  pFileDirectory,
  pResolveOptions
) {
  let lReturnValue = null;

  const lModuleName = resolveHelpers.stripToModuleName(pModule.module);
  if (
    isRelativeModuleName(lModuleName) ||
    ["cjs", "es6", "tsd"].includes(pModule.moduleSystem)
  ) {
    lReturnValue = resolveCommonJS(
      pModule.module,
      pBaseDirectory,
      pFileDirectory,
      pResolveOptions
    );
  } else {
    lReturnValue = resolveAMD(
      pModule.module,
      pBaseDirectory,
      pFileDirectory,
      pResolveOptions
    );
  }
  return lReturnValue;
}

function canBeResolvedToTsVariant(pModuleName) {
  return [".js", ".jsx"].includes(path.extname(pModuleName));
}

function isTypeScriptishExtension(pModuleName) {
  return [".ts", ".tsx"].includes(path.extname(pModuleName));
}
function resolveYarnVirtual(pPath) {
  const pnpAPI = get(monkeyPatchedModule, "findPnpApi", () => false)(pPath);

  // the pnp api only works in plug'n play environemnts, and resolveVirtual
  // only under yarn(berry). As we can't run a 'regular' nodejs environment
  // and a yarn(berry) one at the same time, ignore in the test coverage and
  // cover it in a separate integration test.
  /* c8 ignore start */
  if (pnpAPI && get(pnpAPI, "VERSIONS.resolveVirtual", 0) === 1) {
    return pnpAPI.resolveVirtual(path.resolve(pPath)) || pPath;
  }
  /* c8 ignore stop */
  return pPath;
}

function resolveWithRetry(
  pModule,
  pBaseDirectory,
  pFileDirectory,
  pResolveOptions
) {
  let lReturnValue = resolveModule(
    pModule,
    pBaseDirectory,
    pFileDirectory,
    pResolveOptions
  );
  const lModuleName = resolveHelpers.stripToModuleName(pModule.module);

  // when we feed the typescript compiler an import with an explicit .js(x) extension
  // and the .js(x) file does not exist, it tries files with the .ts, .tsx or
  // .d.ts extensions (this a.o. means ./hello.jsx can resolve to ./hello.ts and
  // ./wut.js to ./wut.tsx).
  //
  // This behavior is very specific:
  // - tsc only (doesn't work in ts-node for instance)
  // - _only_ for the .js and .jsx extensions
  //
  // Hence also this oddly specific looking check & retry.
  //
  // This should eventually probably land in either enhanced_resolve or in a
  // plugin/ extension for it (tsconfig-paths-webpack-plugin?)
  if (lReturnValue.couldNotResolve && canBeResolvedToTsVariant(lModuleName)) {
    const lModuleWithOutExtension = lModuleName.replace(/\.js(x)?$/g, "");

    const lReturnValueCandidate = resolveModule(
      { ...pModule, module: lModuleWithOutExtension },
      pBaseDirectory,
      pFileDirectory,
      pResolveOptions
    );

    if (isTypeScriptishExtension(lReturnValueCandidate.resolved)) {
      lReturnValue = lReturnValueCandidate;
    }
  }
  return lReturnValue;
}
/**
 * resolves the module name of the pDependency to a file on disk.
 *
 * @param  {import("../../../types/cruise-result").IModule} pModule an object with a module and the moduleSystem
 *                              according to which this is a dependency
 * @param  {string} pBaseDirectory    the directory to consider as base (or 'root')
 *                              for resolved files.
 * @param  {string} pFileDirectory    the directory of the file the dependency was
 *                              detected in
 * @param  {import(../../../types/resolve-options").IResolveOptions} pResolveOptions
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
module.exports = function resolve(
  pModule,
  pBaseDirectory,
  pFileDirectory,
  pResolveOptions
) {
  let lResolvedModule = resolveWithRetry(
    pModule,
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
            resolveYarnVirtual(
              path.resolve(
                pBaseDirectory,
                /* enhanced-resolve inserts a NULL character in front of any `#` 
                   character. This wonky replace undoes that so the filename
                   again corresponds with a real file on disk
                 */
                // eslint-disable-next-line no-control-regex
                lResolvedModule.resolved.replace(/\u0000#/g, "#")
              )
            )
          )
        )
      );
    } catch (pError) {
      lResolvedModule.couldNotResolve = true;
    }
  }
  return lResolvedModule;
};
