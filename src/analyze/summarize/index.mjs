import addRuleSetUsed from "./add-rule-set-used.mjs";
import summarizeModules from "./summarize-modules.mjs";
import summarizeFolders from "./summarize-folders.mjs";
import summarizeOptions from "./summarize-options.mjs";
import {
  getViolationCounts,
  getModulesCruisedCount,
  getDependenciesCruisedCount,
  getBaselineDiffCounts,
} from "./get-stats.mjs";
import { compareViolations } from "#graph-utl/compare.mjs";
import { getEnvironmentInfo } from "#environment.mjs";
import { determineEnvironmentIssues } from "./verify-environment.mjs";

/**
 * @import { IOptions, IEnvironmentIssue, ISummary, IModule, IFolder } from "../../../types/cruise-result.mjs"
 * @import { IAvailableTranspiler } from "../../../types/environment.mjs"
 * @import { IStrictCruiseOptions } from "../../../types/strict-options.mjs"
 */

function getAdvisedExitCode(
  pErrorCount,
  pBaselineStaleCount,
  pStaleEntriesSeverity,
) {
  if ((pStaleEntriesSeverity ?? "warn") === "error") {
    return pErrorCount + (pBaselineStaleCount ?? 0);
  }
  return pErrorCount;
}

/**
 *
 * @param {IModule[]} pModules -
 *    cruised modules that have been enriched with mandatory attributes &
 *    have been validated against rules as passed in the options
 * @param {IStrictCruiseOptions} pOptions -
 * @param {string[]} pFileDirectoryArray -
 *    the files/ directories originally passed to be cruised
 * @param {IFolder[]} pFolders -
 *    the pModules collapsed to folders, with their own metrics & deps
 *
 * @returns {ISummary} -
 *    a summary of the found modules, dependencies and any violations
 */
// eslint-disable-next-line max-params
export default function summarize(
  pModules,
  pOptions,
  pFileDirectoryArray,
  pFolders,
  pGetEnvironmentInfoFunction = getEnvironmentInfo,
) {
  const lViolations = summarizeModules(pModules, pOptions.ruleSet)
    .concat(summarizeFolders(pFolders || [], pOptions.ruleSet))
    .sort(compareViolations);

  const lEnvironment = pGetEnvironmentInfoFunction();
  const lEnvironmentWithIssues = {
    ...lEnvironment,
    ...determineEnvironmentIssues(pOptions, lEnvironment.transpilersFound),
  };
  const lViolationCounts = getViolationCounts(lViolations);
  const lBaselineDiffCounts = pOptions.knownViolations
    ? getBaselineDiffCounts(pOptions.knownViolations, lViolations)
    : {};
  const lAdvisedExitCode = getAdvisedExitCode(
    lViolationCounts.error,
    lBaselineDiffCounts?.baselineStale,
    pOptions?.baseline?.staleEntriesSeverity,
  );

  return {
    violations: lViolations,
    ...lViolationCounts,
    ...lBaselineDiffCounts,
    advisedExitCode: lAdvisedExitCode,
    totalCruised: getModulesCruisedCount(pModules),
    totalDependenciesCruised: getDependenciesCruisedCount(pModules),
    ...summarizeOptions(pFileDirectoryArray, pOptions),
    ...(pOptions.ruleSet ? { ruleSetUsed: addRuleSetUsed(pOptions) } : {}),
    environment: lEnvironmentWithIssues,
  };
}
