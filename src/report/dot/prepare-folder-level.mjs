import consolidateToFolder from "../../graph-utl/consolidate-to-folder.js";
import compare from "../../graph-utl/compare.js";
import stripSelfTransitions from "../../graph-utl/strip-self-transitions.js";
import moduleUtl from "./module-utl.mjs";

export default function prepareFolderLevel(pResults, pTheme, _, pShowMetrics) {
  return consolidateToFolder(pResults.modules)
    .sort(compare.modules)
    .map(moduleUtl.extractFirstTransgression)
    .map(moduleUtl.folderify(pShowMetrics))
    .map(stripSelfTransitions)
    .map(moduleUtl.applyTheme(pTheme))
    .map(moduleUtl.addURL(pResults.summary.optionsUsed?.prefix ?? ""));
}
