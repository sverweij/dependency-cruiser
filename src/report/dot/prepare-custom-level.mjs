import moduleUtl from "./module-utl.mjs";
import consolidateToPattern from "#graph-utl/consolidate-to-pattern.mjs";
import compare from "#graph-utl/compare.mjs";
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
    .sort(compare.modules)
    .map(moduleUtl.folderify(pShowMetrics))
    .map(moduleUtl.extractFirstTransgression)
    .map(stripSelfTransitions)
    .map(moduleUtl.applyTheme(pTheme))
    .map(moduleUtl.addURL(pResults.summary.optionsUsed?.prefix ?? ""));
}
