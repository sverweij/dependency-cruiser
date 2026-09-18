import { compareViolations, diffViolationArrays } from "#graph-utl/compare.mjs";
/**
 * @import { ICruiseResult, IReporterOutput } from "../../types/dependency-cruiser.mjs";
 * @import { IViolation} from "../../types/violations.mjs"
 * @import { BaselineModeType } from "../../types/options.mjs"
 */

const DEFAULT_JSON_INDENT = 2;
const EOL = "\n";
const BASELINE_DEFAULT_MODE = "full";

/**
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
  let lModeAdditionTotal = "";
  let lModeAdditionNew = " (running in 'full' mode => added to the baseline)";
  let lModeAdditionOld =
    " (running in 'full' mode => removed from the baseline)";

  if (pMode === "shrink-only") {
    lViolationsToEmit = lViolationArrayDiff.same;
    lModeAdditionNew =
      " (running in 'shrink-only' mode => not added to the baseline)";
    lModeAdditionOld =
      " (running in 'shrink-only' mode => removed from the baseline)";
  }
  if (pMode === "format") {
    lViolationsToEmit = lKnownViolations;
    lModeAdditionTotal = " (running in 'format' mode so no updates made)";
    lModeAdditionNew = "";
    lModeAdditionOld = "";
  }
  lReturnValue.meta =
    `${EOL}baseline  : ${lViolationsToEmit.length} violations${lModeAdditionTotal}${EOL}${EOL}` +
    `  new     : ${lViolationArrayDiff.new.length}${lViolationArrayDiff.new.length > 0 ? lModeAdditionNew : ""}${EOL}` +
    `  same    : ${lViolationArrayDiff.same.length}${EOL}` +
    `  stale   : ${lViolationArrayDiff.old.length}${lViolationArrayDiff.old.length > 0 ? lModeAdditionOld : ""}${EOL}`;
  lReturnValue.output =
    JSON.stringify(
      lViolationsToEmit.toSorted(compareViolations),
      null,
      DEFAULT_JSON_INDENT,
    ) + EOL;

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
