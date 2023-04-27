import bus from "../utl/bus.mjs";
import busLogLevels from "../utl/bus-log-levels.mjs";
import addFocus from "../graph-utl/add-focus.mjs";
import IndexedModuleGraph from "../graph-utl/indexed-module-graph.mjs";
import deriveCycles from "./derive/circular.mjs";
import deriveOrphans from "./derive/orphan/index.mjs";
import addDependents from "./derive/dependents/index.mjs";
import deriveReachable from "./derive/reachable.mjs";
import addValidations from "./add-validations.mjs";
import softenKnownViolations from "./soften-known-violations.mjs";
import deriveModuleMetrics from "./derive/metrics/index.mjs";

export default function enrichModules(pModules, pOptions) {
  bus.emit("progress", "analyzing: cycles", { level: busLogLevels.INFO });
  const lIndexedModules = new IndexedModuleGraph(pModules);
  let lModules = deriveCycles(pModules, lIndexedModules, {
    pSourceAttribute: "source",
    pDependencyName: "resolved",
  });
  bus.emit("progress", "analyzing: dependents", { level: busLogLevels.INFO });
  lModules = addDependents(lModules);
  bus.emit("progress", "analyzing: orphans", { level: busLogLevels.INFO });
  lModules = deriveOrphans(lModules);
  bus.emit("progress", "analyzing: reachables", { level: busLogLevels.INFO });
  lModules = deriveReachable(lModules, pOptions.ruleSet);
  bus.emit("progress", "analyzing: module metrics", {
    level: busLogLevels.INFO,
  });
  lModules = deriveModuleMetrics(lModules, pOptions);
  bus.emit("progress", "analyzing: add focus (if any)", {
    level: busLogLevels.INFO,
  });
  lModules = addFocus(lModules, pOptions.focus);

  // when validate === false we might want to skip the addValidations.
  // We don't at this time, however, as "valid" is a mandatory
  // attribute (to simplify reporter logic)
  bus.emit("progress", "analyzing: validations", { level: busLogLevels.INFO });
  lModules = addValidations(lModules, pOptions.ruleSet, pOptions.validate);

  lModules = softenKnownViolations(lModules, pOptions.knownViolations);

  return lModules;
}
