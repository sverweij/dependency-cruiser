import { EOL } from "node:os";
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
import { getEnvironmentInfo } from "#environment.mjs";

/**
 * @import { IOptions, IEnvironmentIssue, ISummary, IModule, IFolder } from "../../../types/cruise-result.mjs"
 * @import { IAvailableTranspiler } from "../../../types/environment.mjs"
 * @import { IStrictCruiseOptions } from "../../../types/strict-options.mjs"
 */

/**
 * @param { IOptions } pOptions
 * @param { IAvailableTranspiler[] } pAvailableTranspilers
 * @returns { boolean }
 */
function swcIsConsistent(pOptions, pAvailableTranspilers) {
  const lSWCNeeded = (pOptions?.parser ?? "acorn") === "swc";
  return lSWCNeeded
    ? pAvailableTranspilers.some(
        (pTranspiler) => pTranspiler.name === "swc" && pTranspiler.available,
      )
    : true;
}

/**
 * @param { IOptions } pOptions
 * @param { IAvailableTranspiler[] } pAvailableTranspilers
 * @returns { boolean }
 */
function typescriptIsConsistent(pOptions, pAvailableTranspilers) {
  const lTypeScriptNeeded =
    Boolean(pOptions?.tsConfig) ||
    Boolean(pOptions?.tsPreCompilationDeps) ||
    Boolean(pOptions?.detectJSDocImports) ||
    (pOptions?.parser ?? "acorn") === "tsc";
  return lTypeScriptNeeded
    ? pAvailableTranspilers.some(
        (pTranspiler) =>
          pTranspiler.name === "typescript" && pTranspiler.available,
      )
    : true;
}
/**
 * @param { IOptions } pOptions
 * @param { IAvailableTranspiler[] } pAvailableTranspilers
 * @returns { boolean }
 */
function babelIsConsistent(pOptions, pAvailableTranspilers) {
  return Boolean(pOptions?.babelConfig)
    ? pAvailableTranspilers.some(
        (pTranspiler) => pTranspiler.name === "babel" && pTranspiler.available,
      )
    : true;
}

/**
 * @param {IOptions} pOptions
 * @param {IAvailableTranspiler} pAvailableTranspilers
 * @returns {{issues?: IEnvironmentIssue[]}}
 */
function determineEnvironmentIssues(pOptions, pAvailableTranspilers) {
  const lIssues = [];
  if (!typescriptIsConsistent(pOptions, pAvailableTranspilers)) {
    const tsTranspiler = pAvailableTranspilers.find(
      (pTranspiler) => pTranspiler.name === "typescript",
    );

    lIssues.push({
      severity: "warn",
      name: "missing-typescript-transpiler",
      description:
        `dependency-cruiser detected a TypeScript environment,${EOL}` +
        `    but not a compatible TypeScript compiler (${tsTranspiler.name}: ${tsTranspiler.version}). This means${EOL}` +
        `    it's likely to have missed TypeScript sources and dependencies.${EOL}${EOL}` +
        `    Install typescript to get better results (e.g. npm i -D typescript@^6).${EOL}${EOL}` +
        `    => Support for typescript@>=7 will follow when its API is published and stable.${EOL}`,
    });
  }
  if (!swcIsConsistent(pOptions, pAvailableTranspilers)) {
    const swcTranspiler = pAvailableTranspilers.find(
      (pTranspiler) => pTranspiler.name === "swc",
    );

    lIssues.push({
      severity: "warn",
      name: "missing-swc-transpiler",
      description:
        `dependency-cruiser found swc configured as parser, but ${EOL}` +
        `    it did not find a compatible version of swc (${swcTranspiler.name}: ${swcTranspiler.version}).${EOL}` +
        `    dependency-cruiser might have missed some sources or dependencies.${EOL}${EOL}` +
        `    Install swc (e.g. npm i -D @swc/core) to get better results.${EOL}`,
    });
  }
  if (!babelIsConsistent(pOptions, pAvailableTranspilers)) {
    const babelTranspiler = pAvailableTranspilers.find(
      (pTranspiler) => pTranspiler.name === "babel",
    );

    lIssues.push({
      severity: "warn",
      name: "missing-babel-transpiler",
      description:
        `dependency-cruiser detected a babel configuration, but not a${EOL}` +
        `    compatible babel transpiler (${babelTranspiler.name}: ${babelTranspiler.version}). If you indeed use babel,${EOL}` +
        `    dependency-cruiser might have missed some sources or dependencies.${EOL}${EOL}` +
        `    Install babel (e.g. npm i -D @babel/core@^7) to get better results.${EOL}`,
    });
  }
  return lIssues.length > 0 ? { issues: lIssues } : {};
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
