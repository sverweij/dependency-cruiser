import isSameViolation from "./summarize/is-same-violation.mjs";
import { bus } from "#utl/bus.mjs";

function softenModuleViolation(
  pRule,
  pModuleSource,
  pKnownModuleViolations,
  pSoftenedSeverity,
) {
  return {
    ...pRule,
    severity: pKnownModuleViolations.some(
      (pKnownError) =>
        pKnownError.from === pModuleSource &&
        pKnownError.rule.name === pRule.name,
    )
      ? pSoftenedSeverity
      : pRule.severity,
  };
}

function softenDependencyViolation(
  pViolationKey,
  pKnownDependencyViolations,
  pSoftenedSeverity,
) {
  return {
    ...pViolationKey.rule,
    severity: pKnownDependencyViolations.some((pKnownError) =>
      isSameViolation(pKnownError, pViolationKey),
    )
      ? pSoftenedSeverity
      : pViolationKey.rule.severity,
  };
}

function softenDependencyViolations(
  pDependency,
  pModuleSource,
  pKnownDependencyViolations,
  pSoftenedSeverity,
) {
  if (!pDependency.valid) {
    return {
      ...pDependency,
      rules: pDependency.rules.map((pRule) =>
        softenDependencyViolation(
          {
            rule: pRule,
            from: pModuleSource,
            to: pDependency.resolved,
            cycle: pDependency.cycle,
          },
          pKnownDependencyViolations,
          pSoftenedSeverity,
        ),
      ),
    };
  }
  return pDependency;
}

/**
 *
 * @param {import("../../types/cruise-result.mjs").IModule} pModule
 * @param {import("../../types/baseline-violations.mjs").IBaselineViolations} pKnownViolations
 * @param {import("../../types/shared-types.mjs").SeverityType} pSoftenedSeverity
 * @returns {import("../../types/cruise-result.mjs").IModule}
 */
function softenKnownViolation(pModule, pKnownViolations, pSoftenedSeverity) {
  let lReturnValue = pModule;

  if (!pModule.valid) {
    lReturnValue = {
      ...pModule,
      rules: pModule.rules.map((pRule) =>
        softenModuleViolation(
          pRule,
          pModule.source,
          pKnownViolations.filter((pKnownViolation) =>
            ["module", "reachability"].includes(pKnownViolation.type),
          ),
          pSoftenedSeverity,
        ),
      ),
    };
  }

  lReturnValue = {
    ...lReturnValue,
    dependencies: pModule.dependencies.map((pDependency) =>
      softenDependencyViolations(
        pDependency,
        pModule.source,
        pKnownViolations.filter((pKnownViolation) =>
          ["dependency", "cycle", "instability"].includes(pKnownViolation.type),
        ),
        pSoftenedSeverity,
      ),
    ),
  };

  // TODO: folder level violations (e.g. with 'instability' rules - these need
  // to be softened within the "folders" node, which lives next to the "modules"
  // one)

  return lReturnValue;
}

/**
 *
 * @param {import("../../types/cruise-result.mjs").IModule[]} pModules
 * @param {import("../../types/baseline-violations.mjs").IBaselineViolations} pKnownViolations
 * @param {import("../../types/shared-types.mjs").SeverityType} pSoftenedSeverity
 * @returns {import("../../types/cruise-result.mjs").IModule[]}
 */
export default function softenKnownViolations(
  pModules,
  pKnownViolations,
  pSoftenedSeverity = "ignore",
) {
  if (pKnownViolations) {
    bus.info("analyze: compare to known errors");
    return pModules.map((pModule) =>
      softenKnownViolation(pModule, pKnownViolations, pSoftenedSeverity),
    );
  }
  return pModules;
}
