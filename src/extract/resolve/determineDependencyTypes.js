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

function isLocal(pModuleName) {
    return pModuleName.startsWith(".");
}

function isAliased(pModuleName, pAliasObject) {
    return Object.keys(pAliasObject || {}).some(pAliasLHS => pModuleName.startsWith(pAliasLHS));
}

/* eslint max-params:0, complexity:0 */
function determineDependencyTypes (pDependency, pModuleName, pPackageDeps, pBaseDir, pResolveOptions) {
    let lRetval = ["undetermined"];

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
    } else if (isNodeModule(pDependency)) {
        lRetval = determineNodeModuleDependencyTypes(pModuleName, pPackageDeps, pBaseDir);
    } else if (isAliased(pModuleName, (pResolveOptions || {}).alias)){
        lRetval = ["aliased"];
    }

    return lRetval;
}

module.exports = determineDependencyTypes;

/* eslint security/detect-object-injection: 0*/
