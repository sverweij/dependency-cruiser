const path            = require('path');
const isCore          = require('resolve').isCore;
const localNpmHelpers = require('./localNpmHelpers');

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

/*
 * there's a separate 'isBundled' function because bundle(d)Dependencies is
 * an array, and not an object, hence needs different treatment
 */
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

function determineNodeModuleDependencyTypes(pModuleName, pPackageDeps, pFileDir, pResolveOptions) {
    let lRetval = determineNpmDependencyTypes(
        localNpmHelpers.getPackageRoot(pModuleName),
        pPackageDeps
    );

    if (localNpmHelpers.dependencyIsDeprecated(pModuleName, pFileDir, pResolveOptions)) {
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

function determineModuleDependencyTypes(pDependency, pModuleName, pPackageDeps, pFileDir, pResolveOptions) {
    let lRetval = [];

    if (isNodeModule(pDependency)) {
        lRetval = determineNodeModuleDependencyTypes(pModuleName, pPackageDeps, pFileDir, pResolveOptions);
    } else {
        lRetval = ["localmodule"];
    }
    return lRetval;
}

function isModule(pDependency, pModules = ["node_modules"], pBaseDir = ".") {
    return pModules.some(
        // pModules can contain relative paths, but also absolute ones.
        // WebPack treats these differently:
        // - absolute paths only match that exact path
        // - relative paths get a node lookup treatment so "turtle" matches
        //   "turtle", "../turtle", "../../turtle", "../../../turtle" (.. =>
        // turtles all the way down)
        // hence we'll have to test for them in different fashion as well.
        // reference: https://webpack.js.org/configuration/resolve/#resolve-modules
        pModule => {
            if (path.isAbsolute(pModule)){
                return path.resolve(pBaseDir, pDependency.resolved).startsWith(pModule);
            }
            return pDependency.resolved.includes(pModule);
        }
    );
}

function isLocal(pModuleName) {
    return pModuleName.startsWith(".");
}

function isAliased(pModuleName, pAliasObject) {
    return Object.keys(pAliasObject || {}).some(pAliasLHS => pModuleName.startsWith(pAliasLHS));
}

function isLikelyTSAliased(pModuleName, pResolved, pTsConfig) {
    return pTsConfig && !isLocal(pModuleName) && pResolved && !pResolved.includes("node_modules");
}

function isAliassy(pModuleName, pDependency, pResolveOptions){
    return isAliased(pModuleName, pResolveOptions.alias) ||
        isLikelyTSAliased(pModuleName, pDependency.resolved, pResolveOptions.tsConfig);
}

/* eslint max-params:0, complexity:0 */
/**
 *
 * @param {any} pDependency the dependency object with all information found hitherto
 * @param {string} pModuleName the module name as found in the source
 * @param {any} pPackageDeps a package.json, in object format
 * @param {string} pFileDir the directory relative to which to resolve (only used for npm deps here)
 * @param {any} pResolveOptions an enhanced resolve 'resolve' key
 * @param {string} pBaseDir the base directory dependency cruise is run on
 *
 * @return {string[]} an array of dependency types for the dependency
 */
module.exports = (pDependency, pModuleName, pPackageDeps, pFileDir, pResolveOptions, pBaseDir) => {
    let lRetval = ["undetermined"];

    pResolveOptions = pResolveOptions || {};

    if (pDependency.couldNotResolve) {
        lRetval = ["unknown"];
    } else if (isCore(pModuleName)) {
        // this 'isCore' business seems duplicate (it's already in
        // the passed object as `coreModule`- determined by the resolve-AMD or
        // resolve-commonJS module). I want to deprecate the `coreModule`
        // attribute in favor of this one and determining it here will make
        // live easier in the future
        lRetval = ["core"];
    } else if (isLocal(pModuleName)) {
        lRetval = ["local"];
    } else if (isModule(pDependency, pResolveOptions.modules, pBaseDir)) {
        lRetval = determineModuleDependencyTypes(
            pDependency,
            pModuleName,
            pPackageDeps,
            pFileDir,
            pResolveOptions
        );
    } else if (isAliassy(pModuleName, pDependency, pResolveOptions)){
        lRetval = ["aliased"];
    }

    return lRetval;
};

/* eslint security/detect-object-injection: 0*/
