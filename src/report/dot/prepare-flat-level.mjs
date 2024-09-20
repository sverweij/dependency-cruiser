import { flatLabel, extractFirstTransgression, addURL } from "./module-utl.mjs";
import { applyTheme } from "./theming.mjs";
import { compareModules } from "#graph-utl/compare.mjs";

export default function prepareFlatLevel(pResults, pTheme, _, pShowMetrics) {
  return pResults.modules
    .sort(compareModules)
    .map(flatLabel(pShowMetrics))
    .map(extractFirstTransgression)
    .map(applyTheme(pTheme))
    .map(addURL(pResults.summary.optionsUsed?.prefix ?? ""));
}
