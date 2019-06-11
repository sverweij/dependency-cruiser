const isModuleOnlyRule = require('./isModuleOnlyRule');
const matches          = require('./matches');

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

function match(pFrom, pTo) {
    return pRule => {
        const lGroups = extractGroups(pRule.from, pFrom.source);

        /*
         * the replace("$1", lGroup) things below are a bit simplistic (they
         * also match \$, which they probably shouldn't) - but good enough for
         * now.
         */
        return matches.fromPath(pRule, pFrom) &&
            matches.fromPathNot(pRule, pFrom) &&
            matches.toDependencyPath(pRule, pTo, lGroups) &&
            matches.toDependencyPathNot(pRule, pTo, lGroups) &&
            matches.toDependencyTypes(pRule, pTo) &&
            (!pRule.to.hasOwnProperty("moreThanOneDependencyType") ||
                    pTo.dependencyTypes.length > 1
            ) &&
            matches.toLicense(pRule, pTo) &&
            matches.toLicenseNot(pRule, pTo) &&
            propertyEquals(pTo, pRule, "couldNotResolve") &&
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
