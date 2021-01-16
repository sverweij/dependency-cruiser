const fs = require("fs");
const path = require("path");
const memoize = require("lodash/memoize");
const pathToPosix = require("../utl/path-to-posix");
const determineDependencyTypes = require("./determine-dependency-types");
const { isCore } = require("./module-classifiers");
const getManifest = require("./get-manifest");
const resolveHelpers = require("./resolve-helpers");

const fileExists = memoize((pFile) => {
  try {
    fs.accessSync(pFile, fs.R_OK);
  } catch (pError) {
    return false;
  }

  return true;
});

function guessPath(pBaseDirectory, pFileDirectory, pStrippedModuleName) {
  return pathToPosix(
    path.relative(
      pBaseDirectory,
      path.join(pFileDirectory, pStrippedModuleName)
    )
  );
}

function guessLikelyPath(pBaseDirectory, pFileDirectory, pStrippedModuleName) {
  let lReturnValue =
    [".js", ""]
      .map((pExtension) =>
        guessPath(
          pBaseDirectory,
          pFileDirectory,
          `${pStrippedModuleName}${pExtension}`
        )
      )
      .find(fileExists) || pStrippedModuleName;

  return lReturnValue;
}

module.exports = function resolveAMD(
  pRawModuleName,
  pBaseDirectory,
  pFileDirectory,
  pResolveOptions
) {
  // lookups:
  // - [x] could be relative in the end (implemented)
  // - [ ] require.config kerfuffle (command line, html, file, ...)
  // - [ ] maybe use mrjoelkemp/module-lookup-amd ?
  // - [ ] or https://github.com/jaredhanson/amd-resolve ?
  // - [x] funky plugins (json!wappie, ./screeching-cat!sabertooth)
  const lModuleName = resolveHelpers.stripToModuleName(pRawModuleName);
  const lResolvedPath = guessLikelyPath(
    pBaseDirectory,
    pFileDirectory,
    lModuleName
  );

  let lReturnValue = {
    resolved: lResolvedPath,
    coreModule: Boolean(isCore(pRawModuleName)),
    followable: fileExists(lResolvedPath) && lResolvedPath.endsWith(".js"),
    couldNotResolve:
      !Boolean(isCore(pRawModuleName)) && !fileExists(lResolvedPath),
  };

  return {
    ...lReturnValue,
    ...resolveHelpers.addLicenseAttribute(
      lModuleName,
      pBaseDirectory,
      pResolveOptions,
      lReturnValue.resolved
    ),
    dependencyTypes: determineDependencyTypes(
      lReturnValue,
      lModuleName,
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
};

module.exports.clearCache = () => {
  fileExists.cache.clear();
};
