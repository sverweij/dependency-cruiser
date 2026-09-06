import { diffViolationArrays } from "#graph-utl/compare.mjs";

const DEFAULT_JSON_INDENT = 2;
const EOL = "\n";
const BASELINE_DEFAULT_OPTIONS = {
  mode: "full",
};

/**
 *
 * @param {import('../../types/cruise-result.d.mts').ICruiseResult} pCruiseResult
 * @param {{knownViolations: import('../../types/violations.d.mts').IViolation[]}} param1
 * @returns {import('../../types/dependency-cruiser.mjs').IReporterOutput}
 */
function getBaseline(pCruiseResult, { knownViolations }, pBaselineOptions) {
  const lReturnValue = {};
  const lKnownViolations = knownViolations || [];
  const lBaselineOptions = {
    ...BASELINE_DEFAULT_OPTIONS,
    ...(pBaselineOptions || {}),
  };
  const lViolationArrayDiff = diffViolationArrays(
    lKnownViolations,
    pCruiseResult.summary.violations,
  );
  let lViolationsToEmit = pCruiseResult.summary.violations;
  let lModeAddition = " (running in 'full' mode => added to the baseline)";

  if (lBaselineOptions.mode === "prune") {
    lViolationsToEmit = lViolationArrayDiff.same;
    lModeAddition = " (running in 'prune' mode => not added to the baseline)";
  }
  lReturnValue.meta =
    `${EOL}baseline  : ${lViolationsToEmit.length} violations${EOL}${EOL}` +
    `  new     : ${lViolationArrayDiff.new.length}${lViolationArrayDiff.new.length > 0 ? lModeAddition : ""}${EOL}` +
    `  same    : ${lViolationArrayDiff.same.length}${EOL}` +
    `  removed : ${lViolationArrayDiff.old.length}${EOL}`;
  lReturnValue.output =
    JSON.stringify(lViolationsToEmit, null, DEFAULT_JSON_INDENT) + EOL;

  return lReturnValue;
}

/**
 * Returns the current 'baseline' of violations, which can be used
 *
 * @param {import('../../types/dependency-cruiser.mjs').ICruiseResult} pCruiseResult -
 *      the output of a dependency-cruise adhering to dependency-cruiser's
 *      cruise result schema
 * @param {import("../../types/reporter-options").IBaselineOptions} pOptions
 * @returns {import('../../types/dependency-cruiser.mjs').IReporterOutput} -
 *      output: some stats on modules and dependencies in json format
 *      exitCode: 0
 */
export default function baseline(pCruiseResult, pBaselineOptions) {
  const { meta, output } = getBaseline(
    pCruiseResult,
    {
      knownViolations: pCruiseResult.summary.optionsUsed.knownViolations,
    },
    pBaselineOptions,
  );
  return {
    output,
    meta,
    exitCode: 0,
  };
}
