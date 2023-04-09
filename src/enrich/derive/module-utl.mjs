export function isDependent(pResolvedName) {
  return (pModule) =>
    pModule.dependencies.some(
      (pDependency) => pDependency.resolved === pResolvedName
    );
}

export function metricsAreCalculable(pModule) {
  return (
    !pModule.coreModule &&
    !pModule.couldNotResolve &&
    !pModule.matchesDoNotFollow
  );
}

/**
 * returns the Instability of a component given the number of incoming (afferent)
 * and outgoing (efferent) connections ('couplings')
 *
 * @param {number} pEfferentCouplingCount
 * @param {number} pAfferentCouplingCount
 * @returns number
 */
export function calculateInstability(
  pEfferentCouplingCount,
  pAfferentCouplingCount
) {
  // when both afferentCouplings and efferentCouplings equal 0 instability will
  // yield NaN. Judging Bob Martin's intention, a component with no outgoing
  // dependencies is maximum stable (0)
  return (
    pEfferentCouplingCount /
      (pEfferentCouplingCount + pAfferentCouplingCount) || 0
  );
}
