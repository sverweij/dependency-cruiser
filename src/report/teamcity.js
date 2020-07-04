const _get = require("lodash/get");
const tsm = require("teamcity-service-messages");

const CATEGORY = "dependency-cruiser";
const SEVERITY2TEAMCITY_SEVERITY = {
  error: "ERROR",
  warn: "WARNING",
  info: "INFO",
};

function severity2teamcitySeverity(pSeverity) {
  // eslint-disable-next-line security/detect-object-injection
  return SEVERITY2TEAMCITY_SEVERITY[pSeverity];
}

function reportRules(pRules, pViolations) {
  return pRules
    .filter((pRule) =>
      pViolations.some((pViolation) => pRule.name === pViolation.rule.name)
    )
    .map((pRule) =>
      tsm.inspectionType({
        id: pRule.name,
        name: pRule.name,
        description: pRule.comment || pRule.name,
        category: CATEGORY,
      })
    );
}

function reportAllowedRule(pAllowedRule, pViolations) {
  let lReturnValue = [];

  if (
    pAllowedRule.length > 0 &&
    pViolations.some((pViolation) => pViolation.rule.name === "not-in-allowed")
  ) {
    lReturnValue = tsm.inspectionType({
      id: "not-in-allowed",
      name: "not-in-allowed",
      description: "dependency is not in the 'allowed' set of rules",
      category: CATEGORY,
    });
  }
  return lReturnValue;
}

function reportViolatedRules(pRuleSetUsed, pViolations) {
  return reportRules(_get(pRuleSetUsed, "forbidden", []), pViolations)
    .concat(reportAllowedRule(_get(pRuleSetUsed, "allowed", []), pViolations))
    .concat(reportRules(_get(pRuleSetUsed, "required", []), pViolations));
}

function determineTo(pViolation) {
  if (pViolation.cycle) {
    return pViolation.cycle.join(" -> ");
  }
  if (pViolation.via) {
    return `${pViolation.to} ${pViolation.via.join(" -> ")}`;
  }
  return pViolation.to;
}

function bakeViolationMessage(pViolation) {
  return pViolation.from === pViolation.to
    ? pViolation.from
    : `${pViolation.from} -> ${determineTo(pViolation)}`;
}
function reportViolations(pViolations) {
  return pViolations.map((pViolation) =>
    tsm.inspection({
      typeId: pViolation.rule.name,
      message: bakeViolationMessage(pViolation),
      file: pViolation.from,
      SEVERITY: severity2teamcitySeverity(pViolation.rule.severity),
    })
  );
}

/**
 * Returns a bunch of TeamCity service messages:
 * - for each violated rule in the passed results: an `inspectionType` with the name and comment of that rule
 * - for each violation in the passed results: an `inspection` with the violated rule name and the tos and froms
 *
 * @param {ICruiseResult} pResults - the output of a dependency-cruise adhering to ../schema/cruise-result.schema.json
 * @returns {IReporterOutput} - .output: a '\n' separated string of TeamCity service messages
 *                              .exitCode: the number of errors found
 */
module.exports = (pResults) => {
  // this is the documented way to get tsm to emit strings
  // Alternatively we could've used the 'low level API', which
  // involves creating new `Message`s and stringifying those.
  // The abstraction of the 'higher level API' makes this
  // reporter more easy to implement and maintain, despite
  // setting this property directly
  tsm.stdout = false;

  const lRuleSet = _get(pResults, "summary.ruleSetUsed", []);
  const lViolations = _get(pResults, "summary.violations", []);

  return {
    output: reportViolatedRules(lRuleSet, lViolations)
      .concat(reportViolations(lViolations))
      .reduce((pAll, pCurrent) => `${pAll}${pCurrent}\n`, ""),
    exitCode: pResults.summary.error,
  };
};
