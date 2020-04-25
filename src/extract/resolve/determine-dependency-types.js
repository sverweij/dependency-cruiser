const path = require("path");
const isCore = require("./is-core");
const isRelativeModuleName = require("./is-relative-module-name");
const localNpmHelpers = require("./local-npm-helpers");

const NPM2DEP_TYPE = {
  dependencies: "npm",
  devDependencies: "npm-dev",
  optionalDependencies: "npm-optional",
  peerDependencies: "npm-peer",
};

function determineNpmDependencyTypes(pModuleName, pPackageDependencies) {
  let lReturnValue = ["npm-unknown"];

  if (Boolean(pPackageDependencies)) {
    lReturnValue = Object.keys(pPackageDependencies)
      .filter(
        (pKey) =>
          pKey.includes("ependencies") &&
          Object.prototype.hasOwnProperty.call(
            pPackageDependencies[pKey],
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
      lReturnValue = lBundledDependencies.some((pDep) => pDep === pModule);
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
  let lReturnValue = determineNpmDependencyTypes(
    localNpmHelpers.getPackageRoot(pModuleName),
    pPackageDeps
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

function isNodeModule(pDependency) {
  return pDependency.resolved.includes("node_modules");
}

function determineModuleDependencyTypes(
  pDependency,
  pModuleName,
  pPackageDeps,
  pFileDirectory,
  pResolveOptions
) {
  let lReturnValue = [];

  if (isNodeModule(pDependency)) {
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

function isModule(
  pDependency,
  pModules = ["node_modules"],
  pBaseDirectory = "."
) {
  return pModules.some(
    // pModules can contain relative paths, but also absolute ones.
    // WebPack treats these differently:
    // - absolute paths only match that exact path
    // - relative paths get a node lookup treatment so "turtle" matches
    //   "turtle", "../turtle", "../../turtle", "../../../turtle" (.. =>
    // turtles all the way down)
    // hence we'll have to test for them in different fashion as well.
    // reference: https://webpack.js.org/configuration/resolve/#resolve-modules
    (pModule) => {
      if (path.isAbsolute(pModule)) {
        return path
          .resolve(pBaseDirectory, pDependency.resolved)
          .startsWith(pModule);
      }
      return pDependency.resolved.includes(pModule);
    }
  );
}

function isAliased(pModuleName, pAliasObject) {
  return Object.keys(pAliasObject || {}).some((pAliasLHS) =>
    pModuleName.startsWith(pAliasLHS)
  );
}

function isLikelyTSAliased(pModuleName, pResolved, pTsConfig) {
  return (
    pTsConfig &&
    !isRelativeModuleName(pModuleName) &&
    pResolved &&
    !pResolved.includes("node_modules")
  );
}

function isAliassy(pModuleName, pDependency, pResolveOptions) {
  return (
    isAliased(pModuleName, pResolveOptions.alias) ||
    isLikelyTSAliased(
      pModuleName,
      pDependency.resolved,
      pResolveOptions.tsConfig
    )
  );
}

/* eslint max-params:0, complexity:0 */
/**
 *
 * @param {any} pDependency the dependency object with all information found hitherto
 * @param {string} pModuleName the module name as found in the source
 * @param {any} pPackageDeps a package.json, in object format
 * @param {string} pFileDirectory the directory relative to which to resolve (only used for npm deps here)
 * @param {any} pResolveOptions an enhanced resolve 'resolve' key
 * @param {string} pBaseDirectory the base directory dependency cruise is run on
 *
 * @return {string[]} an array of dependency types for the dependency
 */
module.exports = (
  pDependency,
  pModuleName,
  pPackageDeps,
  pFileDirectory,
  pResolveOptions,
  pBaseDirectory
) => {
  let lReturnValue = ["undetermined"];

  pResolveOptions = pResolveOptions || {};

  if (pDependency.couldNotResolve) {
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
  } else if (isModule(pDependency, pResolveOptions.modules, pBaseDirectory)) {
    lReturnValue = determineModuleDependencyTypes(
      pDependency,
      pModuleName,
      pPackageDeps,
      pFileDirectory,
      pResolveOptions
    );
  } else if (isAliassy(pModuleName, pDependency, pResolveOptions)) {
    lReturnValue = ["aliased"];
  }

  return lReturnValue;
};

/* eslint security/detect-object-injection: 0*/
