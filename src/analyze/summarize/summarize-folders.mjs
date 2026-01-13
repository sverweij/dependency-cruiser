import { findRuleByName } from "#graph-utl/rule-set.mjs";

function classifyViolation(pRule, pRuleSet) {
  const lRule = findRuleByName(pRuleSet, pRule.name);
  if (Object.hasOwn(lRule?.to ?? {}, "moreUnstable")) {
    return "instability";
  }
  if (Object.hasOwn(lRule?.to ?? {}, "circular")) {
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
      }),
    );
}

export default function summarizeFolders(pFolders, pRuleSet) {
  return pFolders.flatMap((pFolder) => getViolations(pFolder, pRuleSet));
}
