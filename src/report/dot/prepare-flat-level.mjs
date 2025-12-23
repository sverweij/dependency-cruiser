import { flatLabel, extractFirstTransgression, addURL } from "./module-utl.mjs";
import { applyTheme } from "./theming.mjs";
import { compareModules } from "#graph-utl/compare.mjs";
import consolidateToPattern from "#graph-utl/consolidate-to-pattern.mjs";

export default function prepareFlatLevel(
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
    .map(flatLabel(pShowMetrics))
    .map(extractFirstTransgression)
    .map(applyTheme(pTheme))
    .map(
      addURL(
        pResults.summary.optionsUsed?.prefix ?? "",
        pResults.summary.optionsUsed?.suffix ?? "",
      ),
    );
}
