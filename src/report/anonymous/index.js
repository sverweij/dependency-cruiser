const _clone = require("lodash/clone");
const _get = require("lodash/get");
const anonymizePath = require("./anonymizePath");

function mapCycles(pPathArray, pWordList) {
  return (pPathArray || []).map(pPath => anonymizePath(pPath, pWordList));
}

function anonymizeDependencies(pDependencies, pWordList) {
  return pDependencies.map(pDependency => ({
    ...pDependency,
    resolved: anonymizePath(pDependency.resolved, pWordList),
    module: anonymizePath(pDependency.module, pWordList),
    cycle: mapCycles(pDependency.cycle, pWordList)
  }));
}

function anonymizeModules(pModules, pWordList) {
  return pModules.map(pModule => ({
    ...pModule,
    dependencies: anonymizeDependencies(pModule.dependencies, pWordList),
    source: anonymizePath(pModule.source, pWordList)
  }));
}

function anonymizeViolations(pViolations, pWordList) {
  return pViolations.map(pViolation => ({
    ...pViolation,
    from: anonymizePath(pViolation.from, pWordList),
    to: anonymizePath(pViolation.to, pWordList),
    cycle: mapCycles(pViolation.cycle, pWordList)
  }));
}

function anonymize(pResults, pWordList) {
  const lResults = _clone(pResults);

  lResults.modules = anonymizeModules(lResults.modules, pWordList);
  lResults.summary.violations = anonymizeViolations(
    lResults.summary.violations,
    pWordList
  );

  return lResults;
}

function sanitizeWordList(pWordList) {
  return pWordList
    .map(pString => pString.replace(/[^a-zA-Z-]/g, "_"))
    .filter(pString => pString.match(/^[a-zA-Z-_]+$/g))
    .filter(pString => !pString.match(anonymizePath.WHITELIST_RE));
}

/**
 * Returns the results of a cruise in JSON with all module names
 * anonymized
 * - modules.source
 * - modules.dependencies.resolved
 * - modules.dependencies.module
 * - modules.dependencies.cycle[m]
 * - summary.violations.from
 * - summary.violations.to
 * - summary.violations.cycle[m]
 *
 * (note: the algorith _removes_ elements from pWordList to prevent duplicates,
 * so if the word list is precious to you - pass a clone)
 *
 * @param {any} pResults - the output of a dependency-cruise adhering to ../schema/cruise-result.schema.json
 * @param {string[]} pWordList - list of words to use as replacement strings. If
 *                               not passed the reporter uses the string passed
 *                               in the options (reporterOptions.anon.wordlist)
 *                               or - if that doesn't exist - the empty array
 * @returns {object} - output: the results in JSON format (hence adhering to the same json schema)
 *                     exitCode: 0
 */
module.exports = (
  pResults,
  pWordList = _get(
    pResults,
    "summary.optionsUsed.reporterOptions.anon.wordlist",
    []
  )
) => ({
  output: JSON.stringify(
    anonymize(pResults, sanitizeWordList(pWordList)),
    null,
    "  "
  ),
  exitCode: 0
});
