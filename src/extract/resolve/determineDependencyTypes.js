"use strict";

const resolve         = require("resolve");
const localNpmHelpers = require("./localNpmHelpers");

const npm2depType = {
    "dependencies"         : "npm",
    "devDependencies"      : "npm-dev",
    "optionalDependencies" : "npm-optional",
    "peerDependencies"     : "npm-peer"
};

function determineNpmDependencyTypes(pModuleName, pPackageDeps) {
    let lRetval = ["npm-unknown"];

    if (Boolean(pPackageDeps)) {
        lRetval = Object.keys(pPackageDeps)
            .filter(pKey =>
                pKey.includes("ependencies") &&
                pPackageDeps[pKey].hasOwnProperty(pModuleName)
            )
            .map(pKey => npm2depType[pKey] || "npm-no-pkg");
        lRetval = lRetval.length === 0 ? ["npm-no-pkg"] : lRetval;
    }

    return lRetval;
}

function dependencyIsBundled(pModule, pPackageDeps) {
    let lRetval = false;

    if (Boolean(pPackageDeps)){
        const lBundledDependencies = pPackageDeps.bundledDependencies || pPackageDeps.bundleDependencies;

        if (lBundledDependencies) {
            lRetval = lBundledDependencies.some(pDep => pDep === pModule);
        }
    }
    return lRetval;
}

function determineNodeModuleDependencyTypes(pModuleName, pPackageDeps, pBaseDir) {
    let lRetval = determineNpmDependencyTypes(
        localNpmHelpers.getPackageRoot(pModuleName),
        pPackageDeps
    );

    if (localNpmHelpers.dependencyIsDeprecated(pModuleName, pBaseDir)) {
        lRetval.push("deprecated");
    }
    if (dependencyIsBundled(pModuleName, pPackageDeps)) {
        lRetval.push("npm-bundled");
    }
    return lRetval;
}

function isNodeModule(pDependency) {
    return pDependency.resolved.includes("node_modules");
}

function determineModuleDependencyTypes(pDependency, pModuleName, pPackageDeps, pBaseDir) {
    let lRetval = [];

    if (isNodeModule(pDependency)) {
        lRetval = determineNodeModuleDependencyTypes(pModuleName, pPackageDeps, pBaseDir);
    } else {
        lRetval = ["localmodule"];
    }
    return lRetval;
}

function isModule(pDependency, pModules = ["node_modules"]) {
    return pModules.some(
        pModule => pDependency.resolved.includes(pModule)
    );
}

function isLocal(pModuleName) {
    return pModuleName.startsWith(".");
}

function isAliased(pModuleName, pAliasObject) {
    return Object.keys(pAliasObject || {}).some(pAliasLHS => pModuleName.startsWith(pAliasLHS));
}


/* eslint max-params:0, complexity:0 */
/**
 *
 * @param {any} pDependency the dependency object with all information found hitherto
 * @param {string} pModuleName the module name as found in the source
 * @param {any} pPackageDeps a package.json, in object format
 * @param {string} pBaseDir the directory relative to which to resolve (only used for npm deps here)
 * @param {any} pResolveOptions an enhanced resolve 'resolve' key
 *
 * @return {string[]} an array of dependency types for the dependency
 */
function determineDependencyTypes (pDependency, pModuleName, pPackageDeps, pBaseDir, pResolveOptions) {
    let lRetval = ["undetermined"];

    pResolveOptions = pResolveOptions || {};

    if (pDependency.couldNotResolve) {
        lRetval = ["unknown"];
    } else if (resolve.isCore(pModuleName)) {
        // this 'resolve.isCore' business seems duplicate (it's already in
        // the passed object as `coreModule`- determined by the resolve-AMD or
        // resolve-commonJS module). I want to deprecate the `coreModule`
        // attribute in favor of this one and determining it here will make
        // live easier in the future
        lRetval = ["core"];
    } else if (isLocal(pModuleName)) {
        lRetval = ["local"];
    } else if (isModule(pDependency, pResolveOptions.modules)) {
        lRetval = determineModuleDependencyTypes(
            pDependency,
            pModuleName,
            pPackageDeps,
            pBaseDir
        );
    } else if (isAliased(pModuleName, pResolveOptions.alias)){
        lRetval = ["aliased"];
    }

    return lRetval;
}

module.exports = determineDependencyTypes;

/* eslint security/detect-object-injection: 0*/
