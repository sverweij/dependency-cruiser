import { folderify, addURL, extractFirstTransgression } from "./module-utl.mjs";
import { applyTheme } from "./theming.mjs";
import consolidateToPattern from "#graph-utl/consolidate-to-pattern.mjs";
import { compareModules } from "#graph-utl/compare.mjs";
import stripSelfTransitions from "#graph-utl/strip-self-transitions.mjs";

export default function prepareCustomLevel(
  pResults,
  pTheme,
  pCollapsePattern,
  pShowMetrics,
) {
  return (
    pCollapsePattern
      ? consolidateToPattern(pResults.modules, pCollapsePattern)
      : pResults.modules
  )
    .sort(compareModules)
    .map(folderify(pShowMetrics))
    .map(extractFirstTransgression)
    .map(stripSelfTransitions)
    .map(applyTheme(pTheme))
    .map(addURL(pResults.summary.optionsUsed?.prefix ?? ""));
}
