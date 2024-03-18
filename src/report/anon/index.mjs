import { anonymizePath, WHITELIST_RE } from "./anonymize-path.mjs";

const EOL = "\n";

function anonymizePathArray(pPathArray, pWordList) {
  // the coverage ignore is here because the || [] branch isn't taken when running
  // tests and with the current setup of the anonymize module that's not going
  // to change. Still want to keep the branch from robustness perspective though.
  /* c8 ignore next 1 */
  return (pPathArray || []).map((pPath) => anonymizePath(pPath, pWordList));
}

function anonymizeMiniDependencyArray(
  pMiniDependencyArray,
  pWordList,
  pAttribute = "name",
) {
  return (pMiniDependencyArray || []).map((pMiniDependency) => ({
    ...pMiniDependency,
    [pAttribute]: anonymizePath(pMiniDependency.name, pWordList),
  }));
}

function anonymizeDependencies(pDependencies, pWordList) {
  return pDependencies.map((pDependency) => ({
    ...pDependency,
    resolved: anonymizePath(pDependency.resolved, pWordList),
    module: anonymizePath(pDependency.module, pWordList),
    cycle: anonymizeMiniDependencyArray(pDependency.cycle, pWordList),
  }));
}

function anonymizeReachesModule(pWordList) {
  return (pModule) => ({
    ...pModule,
    source: anonymizePath(pModule.source, pWordList),
    via: anonymizeMiniDependencyArray(pModule.via, pWordList),
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
 * @param {import("../../../types/cruise-result.mjs").IModule[]} pModules
 * @param {string[]} pWordList
 * @returns {import("../../../types/cruise-result.mjs").IModule[]}
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
        pWordList,
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
 * @param {import("../../../types/cruise-result.mjs").IFolder[]} pFolders
 * @param {string[]} pWordList
 * @returns {import("../../../types/cruise-result.mjs").IFolder[]}
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
          lReturnDependencies.cycle = anonymizeMiniDependencyArray(
            pDependency.cycle,
            pWordList,
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
      cycle: anonymizeMiniDependencyArray(pViolation.cycle, pWordList),
    };
    if (pViolation.via) {
      lReturnValue.via = anonymizeMiniDependencyArray(
        pViolation.via,
        pWordList,
      );
    }
    return lReturnValue;
  });
}
/**
 *
 * @param {import("../../../types/cruise-result.mjs").ICruiseResult} pResults
 * @param {string[]} pWordList
 * @returns {import("../../../types/cruise-result.mjs").ICruiseResult}
 */
function anonymize(pResults, pWordList) {
  const lResults = structuredClone(pResults);

  lResults.modules = anonymizeModules(lResults.modules, pWordList);
  if (lResults.folders) {
    lResults.folders = anonymizeFolders(lResults.folders, pWordList);
  }
  lResults.summary.violations = anonymizeViolations(
    lResults.summary.violations,
    pWordList,
  );

  return lResults;
}

function sanitizeWordList(pWordList) {
  return pWordList
    .map((pString) => pString.replace(/[^a-zA-Z-]/g, "_"))
    .filter((pString) => pString.match(/^[a-zA-Z-_]+$/g))
    .filter((pString) => !pString.match(WHITELIST_RE));
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
 * (note: the algorithm _removes_ elements from pWordList to prevent duplicates,
 * so if the word list is precious to you - pass a clone)
 *
 * @param {import("../../../types/cruise-result.mjs").ICruiseResult} pResults - the output of a dependency-cruise adhering to ../schema/cruise-result.schema.json
 * @param {{wordlist?: String[]}} pAnonymousReporterOptions of words to use as replacement strings. If
 *                               not passed the reporter uses the string passed
 *                               in the options (reporterOptions.anon.wordlist)
 *                               or - if that doesn't exist - the empty array
 * @returns {import("../../../types/dependency-cruiser.js").IReporterOutput} - output: the results in JSON format (hence adhering to the same json schema)
 *                              exitCode: 0
 */
export default function reportAnonymous(pResults, pAnonymousReporterOptions) {
  /** @type {{wordlist?: String[]}} */
  let lAnonymousReporterOptions = pAnonymousReporterOptions || {};
  if (!lAnonymousReporterOptions.wordlist) {
    lAnonymousReporterOptions.wordlist =
      pResults?.summary?.optionsUsed?.reporterOptions?.anon?.wordlist ?? [];
  }
  return {
    output:
      JSON.stringify(
        anonymize(
          pResults,
          sanitizeWordList(lAnonymousReporterOptions.wordlist),
        ),
        null,
        "  ",
      ) + EOL,
    exitCode: 0,
  };
}
