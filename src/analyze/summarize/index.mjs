import addRuleSetUsed from "./add-rule-set-used.mjs";
import summarizeModules from "./summarize-modules.mjs";
import summarizeFolders from "./summarize-folders.mjs";
import summarizeOptions from "./summarize-options.mjs";
import {
  getViolationStats,
  getModulesCruised,
  getDependenciesCruised,
} from "./get-stats.mjs";
import { compareViolations } from "#graph-utl/compare.mjs";
import { getAvailableTranspilers } from "#extract/transpile/meta.mjs";
import { getEnvironmentInfo } from "#environment.mjs";

/**
 * @param {import("../../../types/cruise-result.mjs").IOptions} pOptions
 * @param {import("../../../types/dependency-cruiser.mjs").IAvailableTranspiler} pAvailableTranspilers
 * @returns {{issues?: import("../../../types/cruise-result.mjs").IEnvironmentIssue[]}}
 */
function determineEnvironmentIssues(pOptions, pAvailableTranspilers) {
  const lIssues = [];
  if (
    Boolean(pOptions?.tsConfig) &&
    !pAvailableTranspilers.some(
      (pTranspiler) =>
        (pTranspiler.name === "typescript" || pTranspiler.name === "swc") &&
        pTranspiler.available,
    )
  ) {
    const tsCompilers = pAvailableTranspilers.filter((pTranspiler) =>
      ["typescript", "swc"].includes(pTranspiler.name),
    );

    lIssues.push({
      severity: "warn",
      name: "missing-typescript-transpiler",
      description: `need typescript compiler for cruising typescript (${tsCompilers.map((pCompiler) => `${pCompiler.name}: ${pCompiler.version}`).join(" or ")}). Don't have.`,
    });
  }
  return lIssues.length > 0 ? { issues: lIssues } : {};
}

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
  return {
    violations: lViolations,
    ...getViolationStats(lViolations),
    totalCruised: getModulesCruised(pModules),
    totalDependenciesCruised: getDependenciesCruised(pModules),
    ...summarizeOptions(pFileDirectoryArray, pOptions),
    ...(pOptions.ruleSet ? { ruleSetUsed: addRuleSetUsed(pOptions) } : {}),
    environment: lEnvironmentWithIssues,
  };
}
