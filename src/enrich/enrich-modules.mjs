import deriveCycles from "./derive/circular.mjs";
import deriveOrphans from "./derive/orphan/index.mjs";
import addDependents from "./derive/dependents.mjs";
import deriveReachable from "./derive/reachable.mjs";
import addValidations from "./add-validations.mjs";
import softenKnownViolations from "./soften-known-violations.mjs";
import deriveModuleMetrics from "./derive/metrics/index.mjs";
import addFocus from "#graph-utl/add-focus.mjs";
import { bus } from "#utl/bus.mjs";

/** @import { IModule, IOptions } from "../../types/dependency-cruiser.mjs" */

/**
 * @param {IModule[]} pModules
 * @param {IOptions} pOptions
 * @returns {IModule[]}
 */
export default function enrichModules(pModules, pOptions) {
  bus.info("analyze: cycles");

  let lModules = deriveCycles(pModules, {
    pSourceAttribute: "source",
    pDependencyName: "resolved",
    pSkipAnalysisNotInRules: pOptions.skipAnalysisNotInRules,
    pRuleSet: pOptions.ruleSet,
  });
  bus.info("analyze: dependents");
  lModules = addDependents(lModules, pOptions);
  bus.info("analyze: orphans");
  lModules = deriveOrphans(lModules, pOptions);
  bus.info("analyze: reachables");
  lModules = deriveReachable(lModules, pOptions.ruleSet);
  bus.info("analyze: module metrics");
  lModules = deriveModuleMetrics(lModules, pOptions);
  bus.info("analyze: focus");
  lModules = addFocus(lModules, pOptions.focus);

  // when validate === false we might want to skip the addValidations.
  // We don't at this time, however, as "valid" is a mandatory
  // attribute (to simplify reporter logic)
  bus.info("analyze: validations");
  lModules = addValidations(lModules, pOptions.ruleSet, pOptions.validate);

  lModules = softenKnownViolations(lModules, pOptions.knownViolations);

  return lModules;
}
