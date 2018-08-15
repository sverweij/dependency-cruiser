"use strict";
const SEVERITY2COLOR = {
    error : "red",
    warn  : "orange",
    info  : "blue"
};
const DEFAULT_VIOLATION_COLOR = "red";

function severity2Color(pSeverity){
    return SEVERITY2COLOR[pSeverity] || DEFAULT_VIOLATION_COLOR;
}

/* eslint security/detect-object-injection: 0 */
function determineModuleColor(pModule) {
    const MODULE2COLOR = {
        "couldNotResolve": "red",
        "coreModule": "grey"
    };

    if (pModule.hasOwnProperty("valid") && !pModule.valid) {
        return severity2Color(pModule.rules[0].severity);
    }
    return MODULE2COLOR[
        Object.keys(MODULE2COLOR).find(
            (pKey) => pModule[pKey]
        )
    ] || null;
}

/* eslint complexity:0 */
function determineModuleFillColor(pModule) {
    // falsy gets overwritten with the standard color
    let lRetval = null;

    if (pModule.orphan) {
        lRetval = "#ccffcc";
    }

    if (pModule.source && pModule.source.endsWith('.ts')) {
        lRetval = "#ccccff";
    }

    if (pModule.source && pModule.source.endsWith('.json')) {
        lRetval = "#ffc400";
    }

    if (pModule.source && pModule.source.endsWith('.coffee')) {
        lRetval = "#deb887";
    }

    return lRetval;
}

function determineDependencyColor(pDependency) {
    let lColorAddition = {};

    if (pDependency.hasOwnProperty("valid") && !pDependency.valid) {
        lColorAddition.color = severity2Color(pDependency.rule.severity);
    }

    return Object.assign(
        {},
        pDependency,
        lColorAddition
    );
}

module.exports = {
    severity2Color,
    determineModuleColor,
    determineModuleFillColor,
    determineDependencyColor
};
