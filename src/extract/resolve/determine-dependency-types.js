const path = require("path");
const has = require("lodash/has");
const {
  isRelativeModuleName,
  isExternalModule,
  isAliassy,
} = require("./module-classifiers");
const externalModuleHelpers = require("./external-module-helpers");

function dependencyKeyHasModuleName(
  pPackageDependencies,
  pModuleName,
  pPrefix
) {
  return (pKey) =>
    pKey.includes("ependencies") &&
    has(pPackageDependencies[pKey], path.posix.join(pPrefix, pModuleName));
}

const NPM2DEP_TYPE = {
  dependencies: "npm",
  devDependencies: "npm-dev",
  optionalDependencies: "npm-optional",
  peerDependencies: "npm-peer",
};

function findModuleInPackageDependencies(
  pPackageDependencies,
  pModuleName,
  pPrefix
) {
  return Object.keys(pPackageDependencies)
    .filter(
      dependencyKeyHasModuleName(pPackageDependencies, pModuleName, pPrefix)
    )
    .map((pKey) => NPM2DEP_TYPE[pKey] || "npm-no-pkg");
}

function needToLookAtTypesToo(pResolverModulePaths) {
  return (pResolverModulePaths || ["node_modules", "node_modules/@types"]).some(
    (pPath) => pPath.includes("@types")
  );
}

function determineManifestDependencyTypes(
  pModuleName,
  pPackageDependencies,
  pResolverModulePaths
) {
  /** @type {import("../../../types/shared-types").DependencyType[]} */
  let lReturnValue = ["npm-unknown"];

  if (Boolean(pPackageDependencies)) {
    lReturnValue = findModuleInPackageDependencies(
      pPackageDependencies,
      pModuleName,
      ""
    );

    if (
      lReturnValue.length === 0 &&
      needToLookAtTypesToo(pResolverModulePaths)
    ) {
      lReturnValue = findModuleInPackageDependencies(
        pPackageDependencies,
        pModuleName,
        "@types"
      );
    }
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

/**
 *
 * @param {string} pModuleName
 * @param {string} pPackageDeps
 * @param {string} pFileDirectory
 * @param {import("../../../types/dependency-cruiser").IResolveOptions} pResolveOptions
 * @returns {import("../../../types/shared-types").DependencyType[]}
 */
function determineNodeModuleDependencyTypes(
  pModuleName,
  pPackageDeps,
  pFileDirectory,
  pResolveOptions
) {
  /** @type {import("../../../types/shared-types").DependencyType[]} */
  let lReturnValue = determineManifestDependencyTypes(
    externalModuleHelpers.getPackageRoot(pModuleName),
    pPackageDeps,
    pResolveOptions.modules
  );
  if (
    pResolveOptions.resolveDeprecations &&
    externalModuleHelpers.dependencyIsDeprecated(
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

/**
 *
 * @param {import("../../../types/cruise-result").IDependency} pDependency
 * @param {string} pModuleName
 * @param {any} pPackageDeps
 * @param {string} pFileDirectory
 * @param {import("../../../types/dependency-cruiser").IResolveOptions} pResolveOptions
 * @param {string} pBaseDirectory
 * @returns {import("../../../types/shared-types").DependencyType[]}
 */
function determineExternalModuleDependencyTypes(
  pDependency,
  pModuleName,
  pPackageDeps,
  pFileDirectory,
  pResolveOptions,
  pBaseDirectory
) {
  /** @type {import("../../../types/shared-types").DependencyType[]} */
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
 * @param {import("../../../types/cruise-result").IDependency} pDependency the dependency object with all information found hitherto
 * @param {string} pModuleName the module name as found in the source
 * @param {any} pManifest a package.json, in object format
 * @param {string} pFileDirectory the directory relative to which to resolve (only used for npm deps here)
 * @param {any} pResolveOptions an enhanced resolve 'resolve' key
 * @param {string} pBaseDirectory the base directory dependency cruise is run on
 *
 * @return {import("../../../types/shared-types").DependencyType[]} an array of dependency types for the dependency
 */
module.exports = function determineDependencyTypes(
  pDependency,
  pModuleName,
  pManifest,
  pFileDirectory,
  pResolveOptions,
  pBaseDirectory
) {
  /** @type {import("../../../types/shared-types").DependencyType[]}*/
  let lReturnValue = ["undetermined"];
  pResolveOptions = pResolveOptions || {};

  if (pDependency.couldNotResolve) {
    lReturnValue = ["unknown"];
  } else if (pDependency.coreModule) {
    // this business seems duplicate (it's already in
    // the passed object as `coreModule`- determined by the resolve-AMD or
    // resolve-commonJS module). I want to deprecate the `coreModule`
    // attribute in favor of this one and determining it here will make
    // live easier in the future
    lReturnValue = ["core"];
  } else if (isRelativeModuleName(pModuleName)) {
    lReturnValue = ["local"];
  } else if (
    isExternalModule(
      pDependency.resolved,
      pResolveOptions.modules,
      pBaseDirectory
    )
  ) {
    lReturnValue = determineExternalModuleDependencyTypes(
      pDependency,
      pModuleName,
      pManifest,
      pFileDirectory,
      pResolveOptions,
      pBaseDirectory
    );
  } else if (isAliassy(pModuleName, pDependency.resolved, pResolveOptions)) {
    lReturnValue = ["aliased"];
  }

  return lReturnValue.concat(pDependency.dependencyTypes || []);
};

/* eslint security/detect-object-injection: 0*/
