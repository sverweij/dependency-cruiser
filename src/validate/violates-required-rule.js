const matchers = require("./matchers");
const { extractGroups } = require("./utl");

module.exports = function violatesRequiredRule(pRule, pModule) {
  let lReturnValue = false;

  if (
    matchers.modulePath(pRule, pModule) &&
    matchers.modulePathNot(pRule, pModule)
  ) {
    const lGroups = extractGroups(pRule.module, pModule.source);

    lReturnValue = !pModule.dependencies.some((pDependency) =>
      matchers.toPath(pRule, pDependency, lGroups)
    );
  }
  return lReturnValue;
};
