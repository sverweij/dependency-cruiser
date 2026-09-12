import { diffViolationArrays } from "#graph-utl/compare.mjs";
/**
 * @import { ICruiseResult, IReporterOutput } from "../../types/dependency-cruiser.mjs";
 * @import { IViolation} from "../../types/violations.mjs"
 * @import { BaselineModeType } from "../../types/options.mjs"
 */

const DEFAULT_JSON_INDENT = 2;
const EOL = "\n";
const BASELINE_DEFAULT_MODE = "full";

/**
 * @param {ICruiseResult} pCruiseResult
 * @param {IViolation[]} pKnownViolations
 * @param {IViolation[]} pCurrentViolations
 * @param {BaselineModeType} pMode
 * @returns {IReporterOutput}
 */
function getBaseline(pKnownViolations, pCurrentViolations, pMode) {
  const lReturnValue = {};
  const lKnownViolations = pKnownViolations || [];
  const lViolationArrayDiff = diffViolationArrays(
    lKnownViolations,
    pCurrentViolations,
  );
  let lViolationsToEmit = pCurrentViolations;
  let lModeAddition = " (running in 'full' mode => added to the baseline)";

  if (pMode === "shrink-only") {
    lViolationsToEmit = lViolationArrayDiff.same;
    lModeAddition =
      " (running in 'shrink-only' mode => not added to the baseline)";
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
 * @param {ICruiseResult} pCruiseResult -
 *      the output of a dependency-cruise adhering to dependency-cruiser's
 *      cruise result schema
 * @returns {IReporterOutput} -
 *      output: known violations
 *      meta: information to print on a side channel (e.g. stderr)
 *      exitCode: 0
 */
export default function baseline(pCruiseResult) {
  const { meta, output } = getBaseline(
    pCruiseResult.summary.optionsUsed.knownViolations,
    pCruiseResult.summary.violations,
    pCruiseResult.summary.optionsUsed?.baseline?.mode ?? BASELINE_DEFAULT_MODE,
  );
  return {
    output,
    meta,
    exitCode: 0,
  };
}
