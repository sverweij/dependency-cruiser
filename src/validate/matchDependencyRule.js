const intersects       = require('../utl/arrayUtil').intersects;
const isModuleOnlyRule = require('./isModuleOnlyRule');

function propertyEquals(pTo, pRule, pProperty) {
    return pRule.to.hasOwnProperty(pProperty)
        ? pTo[pProperty] === pRule.to[pProperty]
        : true;
}

/* if there is at least one group expression in the given pRulePath
   return the first matched one.
   return null in all other cases

   This fills our current need. Later we can expand it to return all group
   matches.
*/
function extractGroups(pRule, pActualPath) {
    let lRetval = [];

    if (Boolean(pRule.path)) {
        let lMatchResult = pActualPath.match(pRule.path);

        if (Boolean(lMatchResult) && lMatchResult.length > 1) {
            lRetval = lMatchResult;
        }
    }
    return lRetval;
}

function replaceGroupPlaceholders(pString, pExtractedGroups) {
    return pExtractedGroups.reduce(
        (pAll, pThis, pIndex) => pAll.replace(`$${pIndex}`, pThis),
        pString
    );
}

function match(pFrom, pTo) {
    return pRule => {
        const lGroups = extractGroups(pRule.from, pFrom.source);

        /*
         * the replace("$1", lGroup) things below are a bit simplistic (they
         * also match \$, which they probably shouldn't) - but good enough for
         * now.
         */
        return (!pRule.from.path ||
                pFrom.source.match(pRule.from.path)
        ) && (!pRule.from.pathNot ||
                !(pFrom.source.match(pRule.from.pathNot))
        ) && (!pRule.to.path ||
                (lGroups.length > 0
                    ? pTo.resolved.match(replaceGroupPlaceholders(pRule.to.path, lGroups))
                    : pTo.resolved.match(pRule.to.path)
                )
        ) && (!Boolean(pRule.to.pathNot) ||
                !(lGroups.length > 0
                    ? pTo.resolved.match(replaceGroupPlaceholders(pRule.to.pathNot, lGroups))
                    : pTo.resolved.match(pRule.to.pathNot)
                )
        ) && (!pRule.to.dependencyTypes ||
                intersects(pTo.dependencyTypes, pRule.to.dependencyTypes)
        ) && (!pRule.to.hasOwnProperty("moreThanOneDependencyType") ||
                pTo.dependencyTypes.length > 1
        ) && (!pRule.to.license ||
                pTo.license && pTo.license.match(pRule.to.license)
        ) && (!pRule.to.licenseNot ||
                pTo.license && !pTo.license.match(pRule.to.licenseNot)
        ) && propertyEquals(pTo, pRule, "couldNotResolve") &&
                 propertyEquals(pTo, pRule, "circular");
    };
}
const isInteresting = pRule => !isModuleOnlyRule(pRule);

module.exports = {
    match,
    isInteresting
};

/* ignore security/detect-object-injection because:
   - we only use it from within the module with two fixed values
   - the propertyEquals function is not exposed externaly
 */
/* eslint security/detect-object-injection: 0, complexity: 0 */
