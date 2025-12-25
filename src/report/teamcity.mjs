import { randomInt } from "node:crypto";
import { formatPercentage, formatViolation } from "./utl/index.mjs";
/** @import { IInspection, IInspectionType } from "./teamcity.types.ts" */

const CATEGORY = "dependency-cruiser";
const SEVERITY2TEAMCITY_SEVERITY = new Map([
  ["error", "ERROR"],
  ["warn", "WARNING"],
  ["info", "INFO"],
]);
const EOL = "\n";

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
      .replaceAll("|", "||")
      .replaceAll("\n", "|n")
      .replaceAll("\r", "|r")
      .replaceAll("[", "|[")
      .replaceAll("]", "|]")
      // next line
      .replaceAll("\u0085", "|x")
      // line separator
      .replaceAll("\u2028", "|l")
      // paragraph separator
      .replaceAll("\u2029", "|p")
      .replaceAll("'", "|'")
  );
}

/**
 * Returns a random flowId consisting of 10 numeric digits.
 *
 * TeamCity doesn't seem to have demands on the format (it's just a string),
 * but this is what teamcity-service-messages used, so as
 * per the rule of least surprise, this is what we use as well.
 *
 * @return {string} 10 random numeric digits
 */
function getRandomFlowId() {
  const lFlowIdLength = 10;
  // eslint-disable-next-line no-magic-numbers
  const lFlowIdMax = 10 ** lFlowIdLength;

  return randomInt(1, lFlowIdMax).toString().padStart(lFlowIdLength, "0");
}

/**
 * Returns a timestamp in ISO format without the trailing 'Z'. TeamCity
 * didn't use the trailing 'Z' (documented in the teamcity-service-messages
 * source) - not sure whether still the case, but better safe than sorry.
 *
 * @returns {string} a timestamp in ISO format without the trailing 'Z'
 */
function getTimeStamp() {
  return new Date().toISOString().slice(0, -1);
}

/**
 * formats an inspection type TeamCity service message
 * @param {IInspectionType} pInspectionTypeData
 * @returns {string}
 */
function formatInspectionType(pInspectionTypeData) {
  const lAttributes = [];
  lAttributes.push(
    `id='${pInspectionTypeData.id}'`,
    `name='${pInspectionTypeData.name}'`,
    `description='${escape(pInspectionTypeData.description)}'`,
    `category='${pInspectionTypeData.category}'`,
    `flowId='${pInspectionTypeData.flowId}'`,
    `timestamp='${getTimeStamp()}'`,
  );
  return `##teamcity[inspectionType ${lAttributes.join(" ")}]`;
}

/**
 * formats an inspection TeamCity service message
 * @param {IInspection} pInspectionData
 * @returns {string}
 */
function formatInspection(pInspectionData) {
  const lAttributes = [];
  lAttributes.push(
    `typeId='${pInspectionData.typeId}'`,
    `message='${escape(pInspectionData.message)}'`,
  );
  if (pInspectionData.file) {
    lAttributes.push(`file='${pInspectionData.file}'`);
  }
  lAttributes.push(
    `SEVERITY='${pInspectionData.SEVERITY}'`,
    `flowId='${pInspectionData.flowId}'`,
    `timestamp='${getTimeStamp()}'`,
  );

  return `##teamcity[inspection ${lAttributes.join(" ")}]`;
}

function severity2teamcitySeverity(pSeverity) {
  return SEVERITY2TEAMCITY_SEVERITY.get(pSeverity) || "INFO";
}

function reportRules(pRules, pViolations, pFlowId) {
  return pRules
    .filter((pRule) =>
      pViolations.some((pViolation) => pRule.name === pViolation.rule.name),
    )
    .map((pRule) =>
      formatInspectionType({
        id: pRule.name,
        name: pRule.name,
        description: pRule.comment || pRule.name,
        category: CATEGORY,
        flowId: pFlowId,
      }),
    );
}

function reportAllowedRule(pAllowedRule, pViolations, pFlowId) {
  let lReturnValue = [];

  if (
    pAllowedRule.length > 0 &&
    pViolations.some((pViolation) => pViolation.rule.name === "not-in-allowed")
  ) {
    lReturnValue = formatInspectionType({
      id: "not-in-allowed",
      name: "not-in-allowed",
      description: "dependency is not in the 'allowed' set of rules",
      category: CATEGORY,
      flowId: pFlowId,
    });
  }
  return lReturnValue;
}

function reportIgnoredRules(pIgnoredCount, pFlowId) {
  let lReturnValue = [];

  if (pIgnoredCount > 0) {
    lReturnValue = formatInspectionType({
      id: "ignored-known-violations",
      name: "ignored-known-violations",
      description:
        "some dependency violations were ignored; run with --no-ignore-known to see them",
      category: CATEGORY,
      flowId: pFlowId,
    });
  }
  return lReturnValue;
}

function reportViolatedRules(
  pRuleSetUsed,
  pViolations,
  pIgnoredCount,
  pFlowId,
) {
  return reportRules(pRuleSetUsed?.forbidden ?? [], pViolations, pFlowId)
    .concat(
      reportAllowedRule(pRuleSetUsed?.allowed ?? [], pViolations, pFlowId),
    )
    .concat(reportRules(pRuleSetUsed?.required ?? [], pViolations, pFlowId))
    .concat(reportIgnoredRules(pIgnoredCount, pFlowId));
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

function reportIgnoredViolation(pIgnoredCount, pFlowId) {
  let lReturnValue = [];

  if (pIgnoredCount > 0) {
    lReturnValue = formatInspection({
      typeId: "ignored-known-violations",
      flowId: pFlowId,
      message: `${pIgnoredCount} known violations ignored. Run with --no-ignore-known to see them.`,
      SEVERITY: "WARNING",
    });
  }
  return lReturnValue;
}

function reportViolations(pViolations, pIgnoredCount, pFlowId) {
  return pViolations
    .map((pViolation) =>
      formatInspection({
        typeId: pViolation.rule.name,
        flowId: pFlowId,
        message: bakeViolationMessage(pViolation),
        file: pViolation.from,
        SEVERITY: severity2teamcitySeverity(pViolation.rule.severity),
      }),
    )
    .concat(reportIgnoredViolation(pIgnoredCount, pFlowId));
}

/**
 * Returns a bunch of TeamCity service messages:
 * - for each violated rule in the passed results: an `inspectionType` with the
 *   name and comment of that rule
 * - for each violation in the passed results: an `inspection` with the
 *   violated rule name and the tos and froms
 *
 * @param {import("../../types/dependency-cruiser.mjs").ICruiseResult} pResults
 * @returns {import("../../types/dependency-cruiser.mjs").IReporterOutput}
 */
// eslint-disable-next-line complexity
export default function teamcity(pResults) {
  const lFlowId = getRandomFlowId();
  const lRuleSet = pResults?.summary?.ruleSetUsed ?? [];
  const lViolations = (pResults?.summary?.violations ?? []).filter(
    (pViolation) => pViolation.rule.severity !== "ignore",
  );
  const lIgnoredCount = pResults?.summary?.ignore ?? 0;

  return {
    output:
      reportViolatedRules(lRuleSet, lViolations, lIgnoredCount, lFlowId)
        .concat(reportViolations(lViolations, lIgnoredCount, lFlowId))
        .reduce((pAll, pCurrent) => `${pAll}${pCurrent}${EOL}`, "") || EOL,
    exitCode: pResults.summary.error,
  };
}
