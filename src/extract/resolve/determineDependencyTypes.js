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

function dependencyIsDeprecated (pModule, pBaseDir) {
    let lRetval = false;
    let lPackageJson = localNpmHelpers.getPackageJson(pModule, pBaseDir);

    if (Boolean(lPackageJson)){
        lRetval = lPackageJson.hasOwnProperty("deprecated") && lPackageJson.deprecated;
    }
    return lRetval;
}

module.exports = (pDependency, pModuleName, pPackageDeps, pBaseDir) => {
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
    } else if (pModuleName.startsWith(".")) {
        lRetval = ["local"];
    } else if (pDependency.resolved.includes("node_modules")) {
        // probably a node_module  - let's see if we can find it in the package
        // deps - but we're only interested in anything up till the first
        // '/' (if any) - because e.g. 'lodash/fp' is ultimately the 'lodash'
        // package...
        //
        // unless the package is 'scoped (@organization/coolpackage),
        //  in which case we'd need it until the second '/'
        lRetval = determineNpmDependencyTypes(
            localNpmHelpers.getPackageRoot(pModuleName),
            pPackageDeps
        );

        if (dependencyIsDeprecated(pModuleName, pBaseDir)) {
            lRetval.push("deprecated");
        }

    }

    return lRetval;
};

/* eslint security/detect-object-injection: 0*/
