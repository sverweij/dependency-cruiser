const _flattenDeep = require("lodash/flattenDeep");
const get = require("lodash/get");
const has = require("lodash/has");
const uniqWith = require("lodash/uniqWith");
const { findRuleByName } = require("../../graph-utl/rule-set");
const compare = require("../../graph-utl/compare");
const isSameViolation = require("./is-same-violation");

function cutNonTransgressions(pModule) {
  return {
    ...pModule,
    dependencies: pModule.dependencies.filter(
      (pDependency) => pDependency.valid === false
    ),
  };
}

function toDependencyViolationSummary(pRule, pModule, pDependency, pRuleSet) {
  let lReturnValue = {
    type: "dependency",
    from: pModule.source,
    to: pDependency.resolved,
    rule: pRule,
  };

  if (
    has(pDependency, "cycle") &&
    get(findRuleByName(pRuleSet, pRule.name), "to.circular")
  ) {
    lReturnValue = {
      ...lReturnValue,
      type: "cycle",
      cycle: pDependency.cycle,
    };
  }

  if (
    has(pModule, "instability") &&
    has(pDependency, "instability") &&
    has(findRuleByName(pRuleSet, pRule.name), "to.moreUnstable")
  ) {
    lReturnValue = {
      ...lReturnValue,
      type: "instability",
      metrics: {
        from: { instability: pModule.instability },
        to: { instability: pDependency.instability },
      },
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
    { type: "module", from: pModule.source, to: pModule.source, rule: pRule },
  ];
  if (
    pModule.reaches &&
    get(findRuleByName(pRuleSet, pRule.name), "to.reachable")
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
        type: "reachability",
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
  return uniqWith(
    extractDependencyViolations(pModules, pRuleSet)
      .concat(extractModuleViolations(pModules, pRuleSet))
      .sort(compare.violations),
    isSameViolation
  );
};
