import tsm from "teamcity-service-messages";
import { formatPercentage, formatViolation } from "./utl/index.mjs";

const CATEGORY = "dependency-cruiser";
const SEVERITY2TEAMCITY_SEVERITY = new Map([
  ["error", "ERROR"],
  ["warn", "WARNING"],
  ["info", "INFO"],
]);
const EOL = "\n";

function severity2teamcitySeverity(pSeverity) {
  return SEVERITY2TEAMCITY_SEVERITY.get(pSeverity) || "INFO";
}

function reportRules(pRules, pViolations) {
  return pRules
    .filter((pRule) =>
      pViolations.some((pViolation) => pRule.name === pViolation.rule.name),
    )
    .map((pRule) =>
      tsm.inspectionType({
        id: pRule.name,
        name: pRule.name,
        description: pRule.comment || pRule.name,
        category: CATEGORY,
      }),
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

function reportIgnoredRules(pIgnoredCount) {
  let lReturnValue = [];

  if (pIgnoredCount > 0) {
    lReturnValue = tsm.inspectionType({
      id: "ignored-known-violations",
      name: "ignored-known-violations",
      description:
        "some dependency violations were ignored; run with --no-ignore-known to see them",
      category: CATEGORY,
    });
  }
  return lReturnValue;
}

function reportViolatedRules(pRuleSetUsed, pViolations, pIgnoredCount) {
  return reportRules(pRuleSetUsed?.forbidden ?? [], pViolations)
    .concat(reportAllowedRule(pRuleSetUsed?.allowed ?? [], pViolations))
    .concat(reportRules(pRuleSetUsed?.required ?? [], pViolations))
    .concat(reportIgnoredRules(pIgnoredCount));
}

function formatModuleViolation(pViolation) {
  return pViolation.from;
}

function formatDependencyViolation(pViolation) {
  return `${pViolation.from} -> ${pViolation.to}`;
}

function formatCycleViolation(pViolation) {
  return `${pViolation.from} -> ${pViolation.cycle
    .map(({ name }) => name)
    .join(" -> ")}`;
}

function formatReachabilityViolation(pViolation) {
  return `${formatDependencyViolation(pViolation)} ${pViolation.via
    .map(({ name }) => name)
    .join(" -> ")}`;
}

function formatInstabilityViolation(pViolation) {
  return `${formatDependencyViolation(
    pViolation,
  )} (instability: ${formatPercentage(
    pViolation.metrics.from.instability,
  )} -> ${formatPercentage(pViolation.metrics.to.instability)})`;
}

function bakeViolationMessage(pViolation) {
  const lViolationType2Formatter = {
    module: formatModuleViolation,
    dependency: formatDependencyViolation,
    cycle: formatCycleViolation,
    reachability: formatReachabilityViolation,
    instability: formatInstabilityViolation,
  };
  return formatViolation(
    pViolation,
    lViolationType2Formatter,
    formatDependencyViolation,
  );
}

function reportIgnoredViolation(pIgnoredCount) {
  let lReturnValue = [];

  if (pIgnoredCount > 0) {
    lReturnValue = tsm.inspection({
      typeId: "ignored-known-violations",
      message: `${pIgnoredCount} known violations ignored. Run with --no-ignore-known to see them.`,
      SEVERITY: "WARNING",
    });
  }
  return lReturnValue;
}

function reportViolations(pViolations, pIgnoredCount) {
  return pViolations
    .map((pViolation) =>
      tsm.inspection({
        typeId: pViolation.rule.name,
        message: bakeViolationMessage(pViolation),
        file: pViolation.from,
        SEVERITY: severity2teamcitySeverity(pViolation.rule.severity),
      }),
    )
    .concat(reportIgnoredViolation(pIgnoredCount));
}

/**
 * Returns a bunch of TeamCity service messages:
 * - for each violated rule in the passed results: an `inspectionType` with the name and comment of that rule
 * - for each violation in the passed results: an `inspection` with the violated rule name and the tos and froms
 *
 * @param {import("../../types/dependency-cruiser.js").ICruiseResult} pResults
 * @returns {import("../../types/dependency-cruiser.js").IReporterOutput}
 */
export default function teamcity(pResults) {
  // this is the documented way to get tsm to emit strings
  // Alternatively we could've used the 'low level API', which
  // involves creating new `Message`s and stringifying those.
  // The abstraction of the 'higher level API' makes this
  // reporter more easy to implement and maintain, despite
  // setting this property directly
  tsm.stdout = false;

  const lRuleSet = pResults?.summary?.ruleSetUsed ?? [];
  const lViolations = (pResults?.summary?.violations ?? []).filter(
    (pViolation) => pViolation.rule.severity !== "ignore",
  );
  const lIgnoredCount = pResults?.summary?.ignore ?? 0;

  return {
    output:
      reportViolatedRules(lRuleSet, lViolations, lIgnoredCount)
        .concat(reportViolations(lViolations, lIgnoredCount))
        .reduce((pAll, pCurrent) => `${pAll}${pCurrent}\n`, "") || EOL,
    exitCode: pResults.summary.error,
  };
}
