const _flattenDeep = require("lodash/flattenDeep");
const _get = require("lodash/get");
const { findRuleByName } = require("../../graph-utl/rule-set");
const compare = require("../../graph-utl/compare");
const deDuplicateViolations = require("./de-duplicate-violations");

function cutNonTransgressions(pSourceEntry) {
  return {
    source: pSourceEntry.source,
    dependencies: pSourceEntry.dependencies.filter(
      (pDependency) => pDependency.valid === false
    ),
  };
}

function extractMetaData(pViolations) {
  return pViolations.reduce(
    (pAll, pThis) => {
      pAll[pThis.rule.severity] += 1;
      return pAll;
    },
    {
      error: 0,
      warn: 0,
      info: 0,
    }
  );
}
function toDependencyViolationSummary(pRule, pModule, pDependency, pRuleSet) {
  let lReturnValue = {
    from: pModule.source,
    to: pDependency.resolved,
    rule: pRule,
  };

  if (
    pDependency.cycle &&
    _get(findRuleByName(pRuleSet, pRule.name), "to.circular")
  ) {
    lReturnValue = {
      ...lReturnValue,
      cycle: pDependency.cycle,
    };
  }

  return lReturnValue;
}

/**
 * Takes an array of dependencies, and extracts the violations from it.
 *
 * Each violation has a from a to and the violated rule () e.g.
 * {
 *      from: "./here.js",
 *      to: "./there.js",
 *      rule: {
 *          name: "some-rule",
 *          severity: "warn"
 *      }
 * }
 *
 * @param {any} pModules an array of modules
 * @param {any} pRuleSet? a rule set
 * @return {any} an array of violations
 */
function extractDependencyViolations(pModules, pRuleSet) {
  return _flattenDeep(
    pModules
      .map(cutNonTransgressions)
      .filter((pModule) => pModule.dependencies.length > 0)
      .map((pModule) =>
        pModule.dependencies.map((pDependency) =>
          pDependency.rules.map((pRule) =>
            toDependencyViolationSummary(pRule, pModule, pDependency, pRuleSet)
          )
        )
      )
  );
}

function toModuleViolationSummary(pRule, pModule, pRuleSet) {
  let lReturnValue = [
    { from: pModule.source, to: pModule.source, rule: pRule },
  ];
  if (
    pModule.reaches &&
    _get(findRuleByName(pRuleSet, pRule.name), "to.reachable")
  ) {
    lReturnValue = pModule.reaches
      .filter((pReachable) => pReachable.asDefinedInRule === pRule.name)
      .reduce(
        (pAll, pReachable) =>
          pAll.concat(
            pReachable.modules.map((pReachableModule) => ({
              to: pReachableModule.source,
              via: pReachableModule.via,
            }))
          ),
        []
      )
      .map((pToModule) => ({
        from: pModule.source,
        to: pToModule.to,
        rule: pRule,
        via: pToModule.via,
      }));
  }

  return lReturnValue;
}

function extractModuleViolations(pModules, pRuleSet) {
  return pModules
    .filter((pModule) => pModule.valid === false)
    .reduce(
      (pAllModules, pModule) =>
        pAllModules.concat(
          pModule.rules.reduce(
            (pAllRules, pRule) =>
              pAllRules.concat(
                toModuleViolationSummary(pRule, pModule, pRuleSet)
              ),
            []
          )
        ),
      []
    );
}

module.exports = function summarizeModules(pModules, pRuleSet) {
  const lViolations = deDuplicateViolations(
    extractDependencyViolations(pModules, pRuleSet).concat(
      extractModuleViolations(pModules, pRuleSet)
    )
  ).sort(compare.violations);

  return {
    violations: lViolations,
    ...extractMetaData(lViolations),
    totalCruised: pModules.length,
    totalDependenciesCruised: pModules.reduce(
      (pAll, pModule) => pAll + pModule.dependencies.length,
      0
    ),
  };
};

module.exports.extractModuleViolations = extractModuleViolations;
