import { join } from "node:path/posix";
import {
  isRelativeModuleName,
  isExternalModule,
  getAliasTypes,
} from "./module-classifiers.mjs";
import {
  dependencyIsDeprecated,
  getPackageRoot,
} from "./external-module-helpers.mjs";

/**
 * @import { DependencyType } from "../../../types/shared-types.mjs"
 * @import { IResolveOptions, ITranspileOptions } from "../../../types/dependency-cruiser.mjs"
 * @import { IDependency } from "../../../types/cruise-result.mjs"
 * @import { IResolveOptions } from "../../../types/resolve-options.mjs"
 */

function dependencyKeyHasModuleName(
  pPackageDependencies,
  pModuleName,
  pPrefix,
) {
  return (pKey) =>
    pKey.includes("ependencies") &&
    Object.hasOwn(pPackageDependencies[pKey], join(pPrefix, pModuleName));
}

const NPM2DEP_TYPE = new Map([
  ["dependencies", "npm"],
  ["devDependencies", "npm-dev"],
  ["optionalDependencies", "npm-optional"],
  ["peerDependencies", "npm-peer"],
]);

function findModuleInPackageDependencies(
  pPackageDependencies,
  pModuleName,
  pPrefix,
) {
  return Object.keys(pPackageDependencies)
    .filter(
      dependencyKeyHasModuleName(pPackageDependencies, pModuleName, pPrefix),
    )
    .map((pKey) => NPM2DEP_TYPE.get(pKey) || "npm-no-pkg");
}

function needToLookAtTypesToo(pResolverModulePaths) {
  return (pResolverModulePaths || ["node_modules", "node_modules/@types"]).some(
    (pPath) => pPath.includes("@types"),
  );
}

function determineManifestDependencyTypes(
  pModuleName,
  pPackageDependencies,
  pResolverModulePaths,
) {
  /** @type {DependencyType[]} */
  let lReturnValue = ["npm-unknown"];

  if (pPackageDependencies) {
    lReturnValue = findModuleInPackageDependencies(
      pPackageDependencies,
      pModuleName,
      "",
    );

    if (
      lReturnValue.length === 0 &&
      needToLookAtTypesToo(pResolverModulePaths)
    ) {
      lReturnValue = findModuleInPackageDependencies(
        pPackageDependencies,
        pModuleName,
        "@types",
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

  if (pPackageDeps) {
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
 * @param {IResolveOptions} pResolveOptions
 * @returns {DependencyType[]}
 */
function determineNodeModuleDependencyTypes(
  pModuleName,
  pPackageDeps,
  pFileDirectory,
  pResolveOptions,
) {
  /** @type { DependencyType[] } */
  let lReturnValue = determineManifestDependencyTypes(
    getPackageRoot(pModuleName),
    pPackageDeps,
    pResolveOptions.modules,
  );
  if (
    pResolveOptions.resolveDeprecations &&
    dependencyIsDeprecated(pModuleName, pFileDirectory, pResolveOptions)
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
 * @param {IDependency} pDependency
 * @param {string} pModuleName
 * @param {any} pPackageDeps
 * @param {string} pFileDirectory
 * @param {IResolveOptions} pResolveOptions
 * @param {string} pBaseDirectory
 * @returns {DependencyType[]}
 */
function determineExternalModuleDependencyTypes(
  pDependency,
  pModuleName,
  pPackageDeps,
  pFileDirectory,
  pResolveOptions,
  pBaseDirectory,
) {
  /** @type { DependencyType[] } */
  let lReturnValue = [];

  if (
    isExternalModule(pDependency.resolved, ["node_modules"], pBaseDirectory)
  ) {
    lReturnValue = determineNodeModuleDependencyTypes(
      pModuleName,
      pPackageDeps,
      pFileDirectory,
      pResolveOptions,
    );
  } else {
    lReturnValue = ["localmodule"];
  }
  return lReturnValue;
}

/* eslint max-params:0, complexity:0 */
/**
 *
 * @param {IDependency} pDependency the dependency object with all information found hitherto
 * @param {string} pModuleName the module name as found in the source
 * @param {any} pManifest a package.json, in object format
 * @param {string} pFileDirectory the directory relative to which to resolve (only used for npm deps here)
 * @param {IResolveOptions} pResolveOptions an enhanced resolve 'resolve' key
 * @param {string} pBaseDirectory the base directory dependency cruise is run on
 * @param {ITranspileOptions} pTranspileOptions
 *
 * @return { DependencyType[] }an array of dependency types for the dependency
 */
// eslint-disable-next-line max-lines-per-function
export default function determineDependencyTypes(
  pDependency,
  pModuleName,
  pManifest,
  pFileDirectory,
  pResolveOptions,
  pBaseDirectory,
  pTranspileOptions,
) {
  /** @type {DependencyType[]}*/
  let lReturnValue = [];
  const lResolveOptions = pResolveOptions || {};

  if (pDependency.couldNotResolve) {
    return ["unknown"];
  }

  const lAliases = getAliasTypes(
    pModuleName,
    pDependency.resolved,
    lResolveOptions,
    pManifest,
    pTranspileOptions,
  );
  if (lAliases.length > 0) {
    lReturnValue = lAliases;
  }

  if (pDependency.coreModule) {
    // this business seems duplicate (it's already in
    // the passed object as `coreModule`- determined by the resolve-AMD or
    // resolve-commonJS module). I want to deprecate the `coreModule`
    // attribute in favor of this one and determining it here will make
    // live easier in the future
    lReturnValue.push("core");
  } else if (
    isRelativeModuleName(pModuleName) ||
    (lAliases.length > 0 &&
      !isExternalModule(
        pDependency.resolved,
        lResolveOptions.modules,
        pBaseDirectory,
      ))
  ) {
    lReturnValue.push("local");
  } else if (
    isExternalModule(
      pDependency.resolved,
      lResolveOptions.modules,
      pBaseDirectory,
    )
  ) {
    lReturnValue = lReturnValue.concat(
      determineExternalModuleDependencyTypes(
        pDependency,
        pModuleName,
        pManifest,
        pFileDirectory,
        lResolveOptions,
        pBaseDirectory,
      ),
    );
  } else {
    lReturnValue.push("undetermined");
  }

  return lReturnValue.concat(pDependency.dependencyTypes || []);
}

/* eslint security/detect-object-injection: 0*/
