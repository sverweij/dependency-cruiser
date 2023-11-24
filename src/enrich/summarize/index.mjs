import addRuleSetUsed from "./add-rule-set-used.mjs";
import summarizeModules from "./summarize-modules.mjs";
import summarizeFolders from "./summarize-folders.mjs";
import summarizeOptions from "./summarize-options.mjs";
import {
  getViolationStats,
  getModulesCruised,
  getDependenciesCruised,
} from "./get-stats.mjs";
import compare from "#graph-utl/compare.mjs";

/**
 *
 * @param {import("../../../types/cruise-result.mjs").IModule[]} pModules -
 *    cruised modules that have been enriched with mandatory attributes &
 *    have been validated against rules as passed in the options
 * @param {import("../../../types/options.mjs").IStrictCruiseOptions} pOptions -
 * @param {string[]} pFileDirectoryArray -
 *    the files/ directories originally passed to be cruised
 * @param {import("../../../types/dependency-cruiser.js").IFolder[]} pFolders -
 *    the pModules collapsed to folders, with their own metrics & deps
 *
 * @returns {import("../../../types/cruise-result.mjs").ISummary} -
 *    a summary of the found modules, dependencies and any violations
 */
export default function summarize(
  pModules,
  pOptions,
  pFileDirectoryArray,
  pFolders,
) {
  const lViolations = summarizeModules(pModules, pOptions.ruleSet)
    .concat(summarizeFolders(pFolders || [], pOptions.ruleSet))
    .sort(compare.violations);

  return {
    violations: lViolations,
    ...getViolationStats(lViolations),
    totalCruised: getModulesCruised(pModules),
    totalDependenciesCruised: getDependenciesCruised(pModules),
    ...summarizeOptions(pFileDirectoryArray, pOptions),
    ...(pOptions.ruleSet ? { ruleSetUsed: addRuleSetUsed(pOptions) } : {}),
  };
}
