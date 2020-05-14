const path = require("path");
const pathToPosix = require("../../utl/path-to-posix");
const determineDependencyTypes = require("./determine-dependency-types");
const isCore = require("./is-core");
const readPackageDeps = require("./get-manifest-dependencies");
const resolveHelpers = require("./resolve-helpers");
const resolve = require("./resolve");
const isFollowable = require("./is-followable");

function addResolutionAttributes(
  pBaseDirectory,
  pModuleName,
  pFileDirectory,
  pResolveOptions
) {
  let lReturnValue = {};

  if (isCore(pModuleName)) {
    lReturnValue.coreModule = true;
  } else {
    try {
      lReturnValue.resolved = pathToPosix(
        path.relative(
          pBaseDirectory,
          resolve(pModuleName, pFileDirectory, pResolveOptions)
        )
      );
      lReturnValue.followable = isFollowable(
        lReturnValue.resolved,
        pResolveOptions
      );
    } catch (pError) {
      lReturnValue.couldNotResolve = true;
    }
  }
  return lReturnValue;
}

/*
 * resolves both CommonJS and ES6
 */
module.exports = (
  pModuleName,
  pBaseDirectory,
  pFileDirectory,
  pResolveOptions
) => {
  let lReturnValue = {
    resolved: pModuleName,
    coreModule: false,
    followable: false,
    couldNotResolve: false,
    dependencyTypes: ["undetermined"],
    ...addResolutionAttributes(
      pBaseDirectory,
      pModuleName,
      pFileDirectory,
      pResolveOptions
    ),
  };

  return {
    ...lReturnValue,
    ...resolveHelpers.addLicenseAttribute(
      pModuleName,
      pBaseDirectory,
      pResolveOptions
    ),
    dependencyTypes: determineDependencyTypes(
      lReturnValue,
      pModuleName,
      readPackageDeps(
        pFileDirectory,
        pBaseDirectory,
        pResolveOptions.combinedDependencies
      ),
      pFileDirectory,
      pResolveOptions,
      pBaseDirectory
    ),
  };
};
