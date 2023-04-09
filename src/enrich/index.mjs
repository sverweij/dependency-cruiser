import enrichModules from "./enrich-modules.mjs";
import aggregateToFolders from "./derive/folders/index.mjs";
import summarize from "./summarize/index.mjs";

/**
 * Enriches the passed modules with things like cycle detection, validations,
 * metrics, folders and reachability & dependents analysis.
 *
 * Also adds a summary to the cruise result with common stats and the options
 * used in the cruise, so consumers of the cruise result (reporters, depcruise-fmt,
 * caching) can use that.
 *
 * @param {import("../../types/dependency-cruiser.js").IModule[]} pModules
 * @param {import("../../types/dependency-cruiser.js").ICruiseOptions} pOptions
 * @param {string[]} pFileAndDirectoryArray
 * @returns {import("../../types/dependency-cruiser.js").ICruiseResult}
 */
export default function enrich(pModules, pOptions, pFileAndDirectoryArray) {
  const lModules = enrichModules(pModules, pOptions);
  const lFolders = aggregateToFolders(lModules, pOptions);

  const lReturnValue = {
    modules: lModules,
    ...lFolders,
    summary: summarize(
      lModules,
      pOptions,
      pFileAndDirectoryArray,
      lFolders.folders
    ),
  };

  return lReturnValue;
}
