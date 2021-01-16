const path = require("path");
const pathToPosix = require("../utl/path-to-posix");
const determineDependencyTypes = require("./determine-dependency-types");
const { isCore, isFollowable } = require("./module-classifiers");
const getManifest = require("./get-manifest");
const resolveHelpers = require("./resolve-helpers");
const resolve = require("./resolve");

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
module.exports = function resolveCommonJS(
  pRawModuleName,
  pBaseDirectory,
  pFileDirectory,
  pResolveOptions
) {
  const lModuleName = resolveHelpers.stripToModuleName(pRawModuleName);
  const lManifest = getManifest(
    pFileDirectory,
    pBaseDirectory,
    pResolveOptions.combinedDependencies
  );

  let lReturnValue = {
    resolved: lModuleName,
    coreModule: false,
    followable: false,
    couldNotResolve: false,
    dependencyTypes: ["undetermined"],
    ...addResolutionAttributes(
      pBaseDirectory,
      lModuleName,
      pFileDirectory,
      pResolveOptions
    ),
  };

  return {
    ...lReturnValue,
    ...resolveHelpers.addLicenseAttribute(
      lModuleName,
      lReturnValue.resolved,
      { baseDirectory: pBaseDirectory, fileDirectory: pFileDirectory },
      pResolveOptions
    ),
    dependencyTypes: determineDependencyTypes(
      lReturnValue,
      lModuleName,
      lManifest,
      pFileDirectory,
      pResolveOptions,
      pBaseDirectory
    ),
  };
};
