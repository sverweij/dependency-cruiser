import { randomInt } from "node:crypto";
import memoize, { memoizeClear } from "memoize";

import { formatPercentage, formatViolation } from "./utl/index.mjs";

/**
 * Escape string for TeamCity output.
 * @see https://confluence.jetbrains.com/display/TCD65/Build+Script+Interaction+with+TeamCity#BuildScriptInteractionwithTeamCity-servMsgsServiceMessages
 * Copied from https://github.com/pifantastic/teamcity-service-messages/blob/master/lib/message.js#L72
 *
 * @param  {String} pMessageString the string to escape
 * @return {String}
 */
function escape(pMessageString) {
  if (pMessageString === null) {
    return "";
  }

  return (
    pMessageString
      .toString()
      .replace(/\|/g, "||")
      .replace(/\n/g, "|n")
      .replace(/\r/g, "|r")
      .replace(/\[/g, "|[")
      .replace(/\]/g, "|]")
      // next line
      .replace(/\u0085/g, "|x")
      // line separator
      .replace(/\u2028/g, "|l")
      // paragraph separator
      .replace(/\u2029/g, "|p")
      .replace(/'/g, "|'")
  );
}

/**
 * Returns a random flowId consisting of 10 numeric digits. TeamCity doesn't
 * currently seem to have demands on the format (it's just a string as far
 * as I can tell), but this is what teamcity-service-messages used, so as
 * per the rule of least surprise, this is what we use.
 *
 * @return {string} a random flowId consisting of 10 numeric digits
 */
function getRandomFlowIdBare() {
  const lFlowIdLength = 10;
  // eslint-disable-next-line no-magic-numbers
  const lFlowIdMax = 10 ** lFlowIdLength;

  return randomInt(1, lFlowIdMax).toString().padStart(lFlowIdLength, "0");
}

const getRandomFlowId = memoize(getRandomFlowIdBare);

/**
 * Returns a timestamp in ISO format without the trailing 'Z'. It used to be
 * an issue with TeamCity that it didn't use the trailing 'Z' (this is
 * documented in the teamcity-service-messages source code) - not sure whether
 * this is still the case, but this is what we do to be on the safe side.
 *
 * @returns {string} a timestamp in ISO format without the trailing 'Z'
 */
function getTimeStamp() {
  return new Date().toISOString().slice(0, -1);
}

function inspectionType(pData) {
  const lAttributes = [];
  lAttributes.push(
    `id='${pData.id}'`,
    `name='${pData.name}'`,
    `description='${escape(pData.description)}'`,
    `category='${pData.category}'`,
    `flowId='${getRandomFlowId()}'`,
    `timestamp='${getTimeStamp()}'`,
  );
  return `##teamcity[inspectionType ${lAttributes.join(" ")}]`;
}

function inspection(pData) {
  const lAttributes = [];
  lAttributes.push(
    `typeId='${pData.typeId}'`,
    `message='${escape(pData.message)}'`,
  );
  if (pData.file) {
    lAttributes.push(`file='${pData.file}'`);
  }
  lAttributes.push(
    `SEVERITY='${pData.SEVERITY}'`,
    `flowId='${getRandomFlowId()}'`,
    `timestamp='${getTimeStamp()}'`,
  );

  return `##teamcity[inspection ${lAttributes.join(" ")}]`;
}

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
      inspectionType({
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
    lReturnValue = inspectionType({
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
    lReturnValue = inspectionType({
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
    lReturnValue = inspection({
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
      inspection({
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
 * - for each violated rule in the passed results: an `inspectionType` with the
 *   name and comment of that rule
 * - for each violation in the passed results: an `inspection` with the
 *   violated rule name and the tos and froms
 *
 * @param {import("../../types/dependency-cruiser.js").ICruiseResult} pResults
 * @returns {import("../../types/dependency-cruiser.js").IReporterOutput}
 */
// eslint-disable-next-line complexity
export default function teamcity(pResults) {
  memoizeClear(getRandomFlowId);

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
