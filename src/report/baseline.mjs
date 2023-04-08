const DEFAULT_JSON_INDENT = 2;

/**
 * Sample plugin
 *
 * @param {import('../../types/dependency-cruiser').ICruiseResult} pCruiseResult -
 *      the output of a dependency-cruise adhering to dependency-cruiser's
 *      cruise result schema
 * @return {import('../../types/dependency-cruiser').IReporterOutput} -
 *      output: some stats on modules and dependencies in json format
 *      exitCode: 0
 */
export default function baseline(pCruiseResult) {
  return {
    output: JSON.stringify(
      pCruiseResult.summary.violations,
      null,
      DEFAULT_JSON_INDENT
    ),
    exitCode: 0,
  };
}
