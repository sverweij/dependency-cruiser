const fs = require("fs");
const path = require("path");
const monkeyPatchedModule = require("module");
const get = require("lodash/get");
const pathToPosix = require("../utl/path-to-posix");
const { isRelativeModuleName } = require("./module-classifiers");
const resolveAMD = require("./resolve-amd");
const resolveCommonJS = require("./resolve-cjs");
const resolveHelpers = require("./resolve-helpers");
const determineDependencyTypes = require("./determine-dependency-types");
const getManifest = require("./get-manifest");

/**
 *
 * @param {import("../../../types/dependency-cruiser").IModule} pModule
 * @param {string} pBaseDirectory
 * @param {string} pFileDirectory
 * @param {import("../../../types/dependency-cruiser").IResolveOptions} pResolveOptions
 * @returns {any}
 */
function resolveModule(
  pModule,
  pBaseDirectory,
  pFileDirectory,
  pResolveOptions
) {
  let lReturnValue = null;

  const lStrippedModuleName = resolveHelpers.stripToModuleName(pModule.module);
  if (
    isRelativeModuleName(lStrippedModuleName) ||
    ["cjs", "es6", "tsd"].includes(pModule.moduleSystem)
  ) {
    lReturnValue = resolveCommonJS(
      lStrippedModuleName,
      pBaseDirectory,
      pFileDirectory,
      pResolveOptions
    );
  } else {
    lReturnValue = resolveAMD(
      lStrippedModuleName,
      pBaseDirectory,
      pFileDirectory
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

  // the pnp api only works in plug'n play environments, and resolveVirtual
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
  const lStrippedModuleName = resolveHelpers.stripToModuleName(pModule.module);

  // when we feed the typescript compiler an import with an explicit .js(x) extension
  // and the .js(x) file does not exist, it tries files with the .ts, .tsx or
  // .d.ts extensions (this a.o. means ./hello.jsx can resolve to ./hello.ts and
  // ./wut.js to ./wut.tsx).
  //
  // This behavior is very specific:
  // - tsc only (doesn't work in ts-node for instance)
  // - until TypeScript 4.6 only for the .js and .jsx extensions
  // - since TypeScript 4.7 also for .cjs and .mjs (=> .cts, .mts) extensions
  //
  // Hence also this oddly specific looking check & retry.
  //
  // This should eventually probably land in either enhanced_resolve or in a
  // plugin/ extension for it (tsconfig-paths-webpack-plugin?)
  if (
    lReturnValue.couldNotResolve &&
    canBeResolvedToTsVariant(lStrippedModuleName)
  ) {
    const lModuleWithOutExtension = lStrippedModuleName.replace(
      /\.(js|jsx|mjs|cjs)$/g,
      ""
    );

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
 * @param  {Partial <import("../../../types/cruise-result").IDependency>} pDependency
 * @param  {string} pBaseDirectory    the directory to consider as base (or 'root')
 *                              for resolved files.
 * @param  {string} pFileDirectory    the directory of the file the dependency was
 *                              detected in
 * @param  {import("../../../types/resolve-options").IResolveOptions} pResolveOptions
 * @return {Partial <import("../../../types/cruise-result").IDependency>}
 *
 */
// eslint-disable-next-line max-lines-per-function
module.exports = function resolve(
  pDependency,
  pBaseDirectory,
  pFileDirectory,
  pResolveOptions
) {
  let lResolvedDependency = resolveWithRetry(
    pDependency,
    pBaseDirectory,
    pFileDirectory,
    pResolveOptions
  );
  const lStrippedModuleName = resolveHelpers.stripToModuleName(
    pDependency.module
  );

  lResolvedDependency = {
    ...lResolvedDependency,
    ...resolveHelpers.addLicenseAttribute(
      lStrippedModuleName,
      lResolvedDependency.resolved,
      { baseDirectory: pBaseDirectory, fileDirectory: pFileDirectory },
      pResolveOptions
    ),
    dependencyTypes: determineDependencyTypes(
      { ...pDependency, ...lResolvedDependency },
      lStrippedModuleName,
      getManifest(
        pFileDirectory,
        pBaseDirectory,
        pResolveOptions.combinedDependencies
      ),
      pFileDirectory,
      pResolveOptions,
      pBaseDirectory
    ),
  };

  if (
    !pResolveOptions.symlinks &&
    !lResolvedDependency.coreModule &&
    !lResolvedDependency.couldNotResolve
  ) {
    try {
      lResolvedDependency.resolved = pathToPosix(
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
                lResolvedDependency.resolved.replace(/\u0000#/g, "#")
              )
            )
          )
        )
      );
    } catch (pError) {
      lResolvedDependency.couldNotResolve = true;
    }
  }
  return lResolvedDependency;
};
