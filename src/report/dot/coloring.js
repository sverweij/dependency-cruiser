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
    determineDependencyColor
};
