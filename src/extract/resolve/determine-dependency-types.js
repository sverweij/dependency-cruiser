const path = require("path");
const _has = require("lodash/has");
const {
  isRelativeModuleName,
  isCore,
  isExternalModule,
  isAliassy,
} = require("./module-classifiers");
const localNpmHelpers = require("./local-npm-helpers");

function toPackagePaths(pExternalModuleResolvePaths) {
  return (
    pExternalModuleResolvePaths || ["node_modules", "node_modules/@types"]
  ).map((pResolveModule) => pResolveModule.replace(/^node_modules(\/)?/, ""));
}

function dependencyKeyHasModuleName(
  pPackageDependencies,
  pExternalModuleResolvePaths,
  pModuleName
) {
  return (pKey) =>
    pKey.includes("ependencies") &&
    pExternalModuleResolvePaths.some((pResolvePath) =>
      _has(
        pPackageDependencies[pKey],
        path.posix.join(pResolvePath, pModuleName)
      )
    );
}

const NPM2DEP_TYPE = {
  dependencies: "npm",
  devDependencies: "npm-dev",
  optionalDependencies: "npm-optional",
  peerDependencies: "npm-peer",
};

function determineManifestDependencyTypes(
  pModuleName,
  pPackageDependencies,
  pExternalModuleResolvePaths
) {
  let lReturnValue = ["npm-unknown"];
  let lExternalModuleResolvePaths = toPackagePaths(pExternalModuleResolvePaths);

  if (Boolean(pPackageDependencies)) {
    lReturnValue = Object.keys(pPackageDependencies)
      .filter(
        dependencyKeyHasModuleName(
          pPackageDependencies,
          lExternalModuleResolvePaths,
          pModuleName
        )
      )
      .map((pKey) => NPM2DEP_TYPE[pKey] || "npm-no-pkg");
    lReturnValue = lReturnValue.length === 0 ? ["npm-no-pkg"] : lReturnValue;
  }

  return lReturnValue;
}

/*
 * there's a separate 'isBundled' function because bundle(d)Dependencies is
 * an array, and not an object, hence needs different treatment
 */
function dependencyIsBundled(pModule, pPackageDeps) {
  let lReturnValue = false;

  if (Boolean(pPackageDeps)) {
    const lBundledDependencies =
      pPackageDeps.bundledDependencies || pPackageDeps.bundleDependencies;

    if (lBundledDependencies) {
      lReturnValue = lBundledDependencies.includes(pModule);
    }
  }
  return lReturnValue;
}

function determineNodeModuleDependencyTypes(
  pModuleName,
  pPackageDeps,
  pFileDirectory,
  pResolveOptions
) {
  let lReturnValue = determineManifestDependencyTypes(
    localNpmHelpers.getPackageRoot(pModuleName),
    pPackageDeps,
    pResolveOptions.modules
  );

  if (
    localNpmHelpers.dependencyIsDeprecated(
      pModuleName,
      pFileDirectory,
      pResolveOptions
    )
  ) {
    lReturnValue.push("deprecated");
  }
  if (dependencyIsBundled(pModuleName, pPackageDeps)) {
    lReturnValue.push("npm-bundled");
  }
  return lReturnValue;
}

function determineExternalModuleDependencyTypes(
  pDependency,
  pModuleName,
  pPackageDeps,
  pFileDirectory,
  pResolveOptions,
  pBaseDirectory
) {
  let lReturnValue = [];

  if (
    isExternalModule(pDependency.resolved, ["node_modules"], pBaseDirectory)
  ) {
    lReturnValue = determineNodeModuleDependencyTypes(
      pModuleName,
      pPackageDeps,
      pFileDirectory,
      pResolveOptions
    );
  } else {
    lReturnValue = ["localmodule"];
  }
  return lReturnValue;
}

/* eslint max-params:0, complexity:0 */
/**
 *
 * @param {any} pDependency the dependency object with all information found hitherto
 * @param {string} pModuleName the module name as found in the source
 * @param {any} pManifest a package.json, in object format
 * @param {string} pFileDirectory the directory relative to which to resolve (only used for npm deps here)
 * @param {any} pResolveOptions an enhanced resolve 'resolve' key
 * @param {string} pBaseDirectory the base directory dependency cruise is run on
 *
 * @return {string[]} an array of dependency types for the dependency
 */
module.exports = function determineDependencyTypes(
  pModule,
  pModuleName,
  pManifest,
  pFileDirectory,
  pResolveOptions,
  pBaseDirectory
) {
  let lReturnValue = ["undetermined"];

  pResolveOptions = pResolveOptions || {};

  if (pModule.couldNotResolve) {
    lReturnValue = ["unknown"];
  } else if (isCore(pModuleName)) {
    // this 'isCore' business seems duplicate (it's already in
    // the passed object as `coreModule`- determined by the resolve-AMD or
    // resolve-commonJS module). I want to deprecate the `coreModule`
    // attribute in favor of this one and determining it here will make
    // live easier in the future
    lReturnValue = ["core"];
  } else if (isRelativeModuleName(pModuleName)) {
    lReturnValue = ["local"];
  } else if (
    isExternalModule(pModule.resolved, pResolveOptions.modules, pBaseDirectory)
  ) {
    lReturnValue = determineExternalModuleDependencyTypes(
      pModule,
      pModuleName,
      pManifest,
      pFileDirectory,
      pResolveOptions,
      pBaseDirectory
    );
  } else if (isAliassy(pModuleName, pModule.resolved, pResolveOptions)) {
    lReturnValue = ["aliased"];
  }

  return lReturnValue;
};

/* eslint security/detect-object-injection: 0*/
