const bus = require("../utl/bus");
const busLogLevels = require("../utl/bus-log-levels");
const addFocus = require("../../src/graph-utl/add-focus");
const IndexedModuleGraph = require("../graph-utl/indexed-module-graph");
const deriveCycles = require("./derive/circular");
const deriveOrphans = require("./derive/orphan");
const addDependents = require("./derive/dependents");
const deriveReachable = require("./derive/reachable");
const addValidations = require("./add-validations");
const softenKnownViolations = require("./soften-known-violations");
const deriveModuleMetrics = require("./derive/metrics");

module.exports = function enrichModules(pModules, pOptions) {
  bus.emit("progress", "analyzing: cycles", { level: busLogLevels.INFO });
  const lIndexedModules = new IndexedModuleGraph(pModules);
  let lModules = deriveCycles(pModules, lIndexedModules, {
    pSourceAttribute: "source",
    pDependencyName: "resolved",
  });
  bus.emit("progress", "analyzing: dependents", { level: busLogLevels.INFO });
  lModules = addDependents(lModules, pOptions);
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
};
