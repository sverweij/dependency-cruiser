const _get = require('lodash/get');
const DEFAULT_MODULE_COLORING_SCHEME = require('./richModuleColorScheme.json');

const SEVERITY2COLOR = {
    error : "red",
    warn  : "orange",
    info  : "blue"
};
const DEFAULT_VIOLATION_COLOR = "red";

function severity2Color(pSeverity){
    return SEVERITY2COLOR[pSeverity] || DEFAULT_VIOLATION_COLOR;
}

function matchesRE(pValue, pRE) {
    const lMatchResult = pValue.match && pValue.match(pRE);

    return Boolean(lMatchResult) && lMatchResult.length > 0;
}

function moduleMatchesCriteria(pSchemeEntry, pModule) {
    return Object.keys(pSchemeEntry.criteria)
        .every(
            pKey =>
                pModule.hasOwnProperty(pKey) &&
                (
                    pSchemeEntry.criteria[pKey] === pModule[pKey] ||
                    matchesRE(pModule[pKey], pSchemeEntry.criteria[pKey])
                )
        );
}

/* eslint security/detect-object-injection: 0 */
function determineModuleColors(pModule, pColoringScheme) {
    const lColoringScheme = pColoringScheme || DEFAULT_MODULE_COLORING_SCHEME;
    let lInvalidColoring = {};

    if (pModule.hasOwnProperty("valid") && !pModule.valid) {
        const lColor = severity2Color(pModule.rules[0].severity);

        lInvalidColoring = {color: lColor, fontcolor: lColor};
    }
    return Object.assign(
        _get(lColoringScheme.find(pSchemeEntry => moduleMatchesCriteria(pSchemeEntry, pModule)), 'colors', {}),
        lInvalidColoring
    );
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
    determineModuleColors,
    determineDependencyColor
};
