const fs = require("fs");
const path = require("path");
const memoize = require("lodash/memoize");
const pathToPosix = require("../../utl/path-to-posix");
const determineDependencyTypes = require("./determine-dependency-types");
const isCore = require("./is-core");
const readPackageDeps = require("./get-manifest-dependencies");
const resolveHelpers = require("./resolve-helpers");

const fileExists = memoize((pFile) => {
  try {
    fs.accessSync(pFile, fs.R_OK);
  } catch (pError) {
    return false;
  }

  return true;
});

module.exports = (
  pModuleName,
  pBaseDirectory,
  pFileDirectory,
  pResolveOptions
) => {
  // lookups:
  // - [x] could be relative in the end (implemented)
  // - [ ] require.config kerfuffle (command line, html, file, ...)
  // - [ ] maybe use mrjoelkemp/module-lookup-amd ?
  // - [ ] or https://github.com/jaredhanson/amd-resolve ?
  // - [x] funky plugins (json!wappie, ./screeching-cat!sabertooth) -> fixed in 'extract'
  const lProbablePath = pathToPosix(
    path.relative(
      pBaseDirectory,
      path.join(pFileDirectory, `${pModuleName}.js`)
    )
  );
  let lReturnValue = {
    resolved: fileExists(lProbablePath) ? lProbablePath : pModuleName,
    coreModule: Boolean(isCore(pModuleName)),
    followable: fileExists(lProbablePath),
    couldNotResolve:
      !Boolean(isCore(pModuleName)) && !fileExists(lProbablePath),
  };

  // we might want to use resolve options instead of {} here
  return {
    ...lReturnValue,
    ...resolveHelpers.addLicenseAttribute(pModuleName, pBaseDirectory, {}),
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

module.exports.clearCache = () => {
  fileExists.cache.clear();
};
