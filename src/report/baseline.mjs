import { diffViolationArrays } from "#graph-utl/compare.mjs";

const DEFAULT_JSON_INDENT = 2;
const EOL = "\n";

/**
 *
 * @param {import('../../types/cruise-result.d.mts').ICruiseResult} pCruiseResult
 * @param {{knownViolations: import('../../types/violations.d.mts').IViolation[]}} param1
 * @returns {import('../../types/dependency-cruiser.mjs').IReporterOutput}
 */
function getBaseline(pCruiseResult, { knownViolations }) {
  const lReturnValue = {};
  const lKnownViolations = knownViolations || [];
  const lViolationArrayDiff = diffViolationArrays(
    lKnownViolations,
    pCruiseResult.summary.violations,
  );
  lReturnValue.meta = `${lViolationArrayDiff.new.length} new, ${lViolationArrayDiff.same.length} same, ${lViolationArrayDiff.old.length} removed`;
  lReturnValue.output =
    JSON.stringify(
      pCruiseResult.summary.violations,
      null,
      DEFAULT_JSON_INDENT,
    ) + EOL;
  return lReturnValue;
}

/**
 * Sample plugin
 *
 * @param {import('../../types/dependency-cruiser.mjs').ICruiseResult} pCruiseResult -
 *      the output of a dependency-cruise adhering to dependency-cruiser's
 *      cruise result schema
 * @returns {import('../../types/dependency-cruiser.mjs').IReporterOutput} -
 *      output: some stats on modules and dependencies in json format
 *      exitCode: 0
 */
export default function baseline(pCruiseResult) {
  const { meta, output } = getBaseline(pCruiseResult, {
    knownViolations: pCruiseResult.summary.optionsUsed.knownViolations,
  });
  return {
    output,
    meta,
    exitCode: 0,
  };
}
