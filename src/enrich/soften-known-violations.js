const bus = require("../utl/bus");
const busLogLevels = require("../utl/bus-log-levels");

function softenModuleViolation(
  pRule,
  pModuleSource,
  pKnownModuleViolations,
  pSoftenedSeverity
) {
  return {
    ...pRule,
    severity: pKnownModuleViolations.some(
      (pKnownError) =>
        pKnownError.from === pModuleSource &&
        pKnownError.rule.name === pRule.name
    )
      ? pSoftenedSeverity
      : pRule.severity,
  };
}

function knownErrorMatchesViolation(pKnownError, pViolationKey) {
  if (pKnownError.rule.name === pViolationKey.rule.name) {
    if (pViolationKey.cycle && pKnownError.cycle) {
      return (
        pKnownError.cycle.length === pViolationKey.cycle.length &&
        pKnownError.cycle.every((pModule) =>
          pViolationKey.cycle.includes(pModule)
        )
      );
    } else {
      return (
        pKnownError.from === pViolationKey.from &&
        pKnownError.to === pViolationKey.to
      );
    }
  }
  return false;
}

function softenDependencyViolation(
  pViolationKey,
  pKnownDependencyViolations,
  pSoftenedSeverity
) {
  return {
    ...pViolationKey.rule,
    severity: pKnownDependencyViolations.some((pKnownError) =>
      knownErrorMatchesViolation(pKnownError, pViolationKey)
    )
      ? pSoftenedSeverity
      : pViolationKey.rule.severity,
  };
}

function softenDependencyViolations(
  pDependency,
  pModuleSource,
  pKnownDependencyViolations,
  pSoftenedSeverity
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
          pSoftenedSeverity
        )
      ),
    };
  }
  return pDependency;
}
/**
 *
 * @param {import("../../types/cruise-result").IModule} pModule
 * @param {import("../../types/baseline-violations").IBaselineViolations} pKnownViolations
 * @param {import("../../types/shared-types").SeverityType} pSoftenedSeverity
 * @returns {import("../../types/cruise-result").IModule}
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
          pKnownViolations.filter(
            (pKnownError) => pKnownError.from === pKnownError.to
          ),
          pSoftenedSeverity
        )
      ),
    };
  }

  lReturnValue = {
    ...lReturnValue,
    dependencies: pModule.dependencies.map((pDependency) =>
      softenDependencyViolations(
        pDependency,
        pModule.source,
        pKnownViolations.filter(
          (pKnownError) => pKnownError.from !== pKnownError.to
        ),
        pSoftenedSeverity
      )
    ),
  };

  return lReturnValue;
}

/**
 *
 * @param {import("../../types/cruise-result").IModule[]} pModules
 * @param {import("../../types/baseline-violations").IBaselineViolations} pKnownViolations
 * @param {import("../../types/shared-types").SeverityType} pSoftenedSeverity
 * @returns {import("../../types/cruise-result").IModule[]}
 */
module.exports = function softenKnownViolations(
  pModules,
  pKnownViolations,
  pSoftenedSeverity = "ignore"
) {
  if (Boolean(pKnownViolations)) {
    bus.emit("progress", "analyzing: comparing against known errors", {
      level: busLogLevels.INFO,
    });
    return pModules.map((pModule) =>
      softenKnownViolation(pModule, pKnownViolations, pSoftenedSeverity)
    );
  }
  return pModules;
};
