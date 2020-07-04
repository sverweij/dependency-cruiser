const isModuleOnlyRule = require("./is-module-only-rule");
const matchers = require("./matchers");
const { extractGroups } = require("./utl");

function propertyEquals(pTo, pRule, pProperty) {
  // ignore security/detect-object-injection because:
  // - we only use it from within the module with two fixed values
  // - the propertyEquals function is not exposed externaly
  return Object.prototype.hasOwnProperty.call(pRule.to, pProperty)
    ? // eslint-disable-next-line security/detect-object-injection
      pTo[pProperty] === pRule.to[pProperty]
    : true;
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
      // preCompilationOnly is not a mandatory attribute, but if the attribute
      // is in the rule but not in the dependency there won't be a match
      // anyway, so we can use the default propertyEquals method regardless
      propertyEquals(pTo, pRule, "preCompilationOnly") &&
      // couldNotResolve, circular, dynamic and exoticallyRequired are
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
