const has = require("lodash/has");
const { findRuleByName } = require("../../graph-utl/rule-set");

function classifyViolation(pRule, pRuleSet) {
  const lRule = findRuleByName(pRuleSet, pRule.name);
  if (has(lRule, "to.moreUnstable")) {
    return "instability";
  }
  if (has(lRule, "to.circular")) {
    return "cycle";
  }
  return "folder";
}

function getViolations(pFolder, pRuleSet) {
  return pFolder.dependencies
    .filter((pDependency) => !pDependency.valid)
    .flatMap((pDependency) =>
      pDependency.rules.map((pRule) => {
        const lViolationType = classifyViolation(pRule, pRuleSet);

        return {
          type: lViolationType,
          from: pFolder.name,
          to: pDependency.name,
          rule: pRule,
          ...(lViolationType === "instability"
            ? {
                metrics: {
                  from: { instability: pFolder.instability },
                  to: { instability: pDependency.instability },
                },
              }
            : {}),
          ...(lViolationType === "cycle"
            ? {
                cycle: pDependency.cycle,
              }
            : {}),
        };
      })
    );
}

module.exports = function summarizeFolders(pFolders, pRuleSet) {
  return pFolders.flatMap((pFolder) => getViolations(pFolder, pRuleSet));
};
