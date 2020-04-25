const isModuleOnlyRule = require("./is-module-only-rule");
const matchers = require("./matchers");

function propertyEquals(pTo, pRule, pProperty) {
  // ignore security/detect-object-injection because:
  // - we only use it from within the module with two fixed values
  // - the propertyEquals function is not exposed externaly
  return Object.prototype.hasOwnProperty.call(pRule.to, pProperty)
    ? // eslint-disable-next-line security/detect-object-injection
      pTo[pProperty] === pRule.to[pProperty]
    : true;
}

/* if there is at least one group expression in the given pRulePath
   return the first matched one.
   return null in all other cases

   This fills our current need. Later we can expand it to return all group
   matches.
*/
function extractGroups(pRule, pActualPath) {
  let lReturnValue = [];

  if (Boolean(pRule.path)) {
    let lMatchResult = pActualPath.match(pRule.path);

    if (Boolean(lMatchResult) && lMatchResult.length > 1) {
      lReturnValue = lMatchResult.filter(
        (pResult) => typeof pResult === "string"
      );
    }
  }
  return lReturnValue;
}

function match(pFrom, pTo) {
  // eslint-disable-next-line complexity
  return (pRule) => {
    const lGroups = extractGroups(pRule.from, pFrom.source);

    return (
      matchers.fromPath(pRule, pFrom) &&
      matchers.fromPathNot(pRule, pFrom) &&
      matchers.toPath(pRule, pTo, lGroups) &&
      matchers.toPathNot(pRule, pTo, lGroups) &&
      matchers.toDependencyTypes(pRule, pTo) &&
      (!Object.prototype.hasOwnProperty.call(
        pRule.to,
        "moreThanOneDependencyType"
      ) ||
        pTo.dependencyTypes.length > 1) &&
      matchers.toLicense(pRule, pTo) &&
      matchers.toLicenseNot(pRule, pTo) &&
      matchers.toExoticRequire(pRule, pTo) &&
      matchers.toExoticRequireNot(pRule, pTo) &&
      propertyEquals(pTo, pRule, "preCompilationOnly") &&
      propertyEquals(pTo, pRule, "couldNotResolve") &&
      propertyEquals(pTo, pRule, "circular") &&
      propertyEquals(pTo, pRule, "dynamic") &&
      propertyEquals(pTo, pRule, "exoticallyRequired")
    );
  };
}
const isInteresting = (pRule) => !isModuleOnlyRule(pRule);

module.exports = {
  match,
  isInteresting,
};
