import { folderify, extractFirstTransgression, addURL } from "./module-utl.mjs";
import { applyTheme } from "./theming.mjs";
import consolidateToFolder from "#graph-utl/consolidate-to-folder.mjs";
import { compareModules } from "#graph-utl/compare.mjs";
import stripSelfTransitions from "#graph-utl/strip-self-transitions.mjs";
// fuk eslint

export default function prepareFolderLevel(pResults, pTheme, _, pShowMetrics) {
  return consolidateToFolder(pResults.modules)
    .sort(compareModules)
    .map(extractFirstTransgression)
    .map(folderify(pShowMetrics))
    .map(stripSelfTransitions)
    .map(applyTheme(pTheme))
    .map(addURL(pResults.summary.optionsUsed?.prefix ?? ""));
}
