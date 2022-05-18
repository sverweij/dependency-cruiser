const clone = require("lodash/clone");
const get = require("lodash/get");
const has = require("lodash/has");
const anonymizePath = require("./anonymize-path");

function anonymizePathArray(pPathArray, pWordList) {
  return (pPathArray || []).map((pPath) => anonymizePath(pPath, pWordList));
}

function anonymizeDependencies(pDependencies, pWordList) {
  return pDependencies.map((pDependency) => ({
    ...pDependency,
    resolved: anonymizePath(pDependency.resolved, pWordList),
    module: anonymizePath(pDependency.module, pWordList),
    cycle: anonymizePathArray(pDependency.cycle, pWordList),
  }));
}

function anonymizeReachesModule(pWordList) {
  return (pModule) => ({
    ...pModule,
    source: anonymizePath(pModule.source, pWordList),
    via: anonymizePathArray(pModule.via, pWordList),
  });
}

function anonymizeReaches(pReachesArray, pWordList) {
  return pReachesArray.map((pReaches) => ({
    ...pReaches,
    modules: pReaches.modules.map(anonymizeReachesModule(pWordList)),
  }));
}

/**
 *
 * @param {import("../../../types/cruise-result").IModule[]} pModules
 * @param {string[]} pWordList
 * @returns {import("../../../types/cruise-result").IModule[]}
 */
function anonymizeModules(pModules, pWordList) {
  return pModules.map((pModule) => {
    const lReturnValue = {
      ...pModule,
      dependencies: anonymizeDependencies(pModule.dependencies, pWordList),
      source: anonymizePath(pModule.source, pWordList),
    };
    if (pModule.dependents) {
      lReturnValue.dependents = anonymizePathArray(
        pModule.dependents,
        pWordList
      );
    }
    if (pModule.reaches) {
      lReturnValue.reaches = anonymizeReaches(pModule.reaches, pWordList);
    }

    return lReturnValue;
  });
}
/**
 *
 * @param {import("../../../types/cruise-result").IFolder[]} pFolders
 * @param {string[]} pWordList
 * @returns {import("../../../types/cruise-result").IFolder[]}
 */
function anonymizeFolders(pFolders, pWordList) {
  return pFolders.map((pFolder) => {
    const lReturnValue = {
      ...pFolder,
      name: anonymizePath(pFolder.name, pWordList),
    };
    if (pFolder.dependencies) {
      lReturnValue.dependencies = pFolder.dependencies.map((pDependency) => {
        const lReturnDependencies = {
          ...pDependency,
          name: anonymizePath(pDependency.name, pWordList),
        };
        if (lReturnDependencies.cycle) {
          lReturnDependencies.cycle = anonymizePathArray(
            pDependency.cycle,
            pWordList
          );
        }
        return lReturnDependencies;
      });
    }
    if (pFolder.dependents) {
      lReturnValue.dependents = pFolder.dependents.map((pDependent) => ({
        ...pDependent,
        name: anonymizePath(pDependent.name, pWordList),
      }));
    }
    return lReturnValue;
  });
}

function anonymizeViolations(pViolations, pWordList) {
  return pViolations.map((pViolation) => {
    const lReturnValue = {
      ...pViolation,
      from: anonymizePath(pViolation.from, pWordList),
      to: anonymizePath(pViolation.to, pWordList),
      cycle: anonymizePathArray(pViolation.cycle, pWordList),
    };
    if (pViolation.via) {
      lReturnValue.via = anonymizePathArray(pViolation.via, pWordList);
    }
    return lReturnValue;
  });
}
/**
 *
 * @param {import("../../../types/cruise-result").ICruiseResult} pResults
 * @param {string[]} pWordList
 * @returns {import("../../../types/cruise-result").ICruiseResult}
 */
function anonymize(pResults, pWordList) {
  const lResults = clone(pResults);

  lResults.modules = anonymizeModules(lResults.modules, pWordList);
  if (lResults.folders) {
    lResults.folders = anonymizeFolders(lResults.folders, pWordList);
  }
  lResults.summary.violations = anonymizeViolations(
    lResults.summary.violations,
    pWordList
  );

  return lResults;
}

function sanitizeWordList(pWordList) {
  return pWordList
    .map((pString) => pString.replace(/[^a-zA-Z-]/g, "_"))
    .filter((pString) => pString.match(/^[a-zA-Z-_]+$/g))
    .filter((pString) => !pString.match(anonymizePath.WHITELIST_RE));
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
 * @param {import("../../../types/cruise-result").ICruiseResult} pResults - the output of a dependency-cruise adhering to ../schema/cruise-result.schema.json
 * @param {{wordlist?: String[]}} pAnonymousReporterOptions of words to use as replacement strings. If
 *                               not passed the reporter uses the string passed
 *                               in the options (reporterOptions.anon.wordlist)
 *                               or - if that doesn't exist - the empty array
 * @returns {import("../../../types/dependency-cruiser").IReporterOutput} - output: the results in JSON format (hence adhering to the same json schema)
 *                              exitCode: 0
 */
module.exports = function reportAnonymous(pResults, pAnonymousReporterOptions) {
  /** @type {{wordlist?: String[]}} */
  let lAnonymousReporterOptions = pAnonymousReporterOptions || {};
  if (!has(lAnonymousReporterOptions, "wordlist")) {
    lAnonymousReporterOptions.wordlist = get(
      pResults,
      "summary.optionsUsed.reporterOptions.anon.wordlist",
      []
    );
  }
  return {
    output: JSON.stringify(
      anonymize(pResults, sanitizeWordList(lAnonymousReporterOptions.wordlist)),
      null,
      "  "
    ),
    exitCode: 0,
  };
};
