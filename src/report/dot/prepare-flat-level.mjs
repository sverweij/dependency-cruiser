import moduleUtl from "./module-utl.mjs";
import compare from "#graph-utl/compare.mjs";

export default function prepareFlatLevel(pResults, pTheme, _, pShowMetrics) {
  return pResults.modules
    .sort(compare.modules)
    .map(moduleUtl.flatLabel(pShowMetrics))
    .map(moduleUtl.extractFirstTransgression)
    .map(moduleUtl.applyTheme(pTheme))
    .map(moduleUtl.addURL(pResults.summary.optionsUsed?.prefix ?? ""));
}
