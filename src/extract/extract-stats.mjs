import {
  getStats as tscStats,
  shouldUse as tscShouldUse,
} from "./tsc/extract.mjs";
import { getStats as acornStats } from "./acorn/extract.mjs";

/**
 * @param {IStrictCruiseOptions} pCruiseOptions
 * @param {string} pFileName
 * @returns {(IStrictCruiseOptions, string, any) => import("../../types/cruise-result.mjs").IDependency[]}
 */
function determineExtractionFunction(pCruiseOptions, pFileName) {
  let lExtractionFunction = acornStats;

  if (tscShouldUse(pCruiseOptions, pFileName)) {
    lExtractionFunction = tscStats;
  }

  return lExtractionFunction;
}

/**
 * Returns some stats for the module in pFileName
 *
 * @param  {string} pFileName path to the file
 * @param  {import("../../types/dependency-cruiser.js").IStrictCruiseOptions} pCruiseOptions cruise options
 * @param  {import("../../types/dependency-cruiser.js").ITranspileOptions} pTranspileOptions       an object with tsconfig ('typescript project') options
 *                               ('flattened' so there's no need for file access on any
 *                               'extends' option in there)
 * @return {import("../../types/dependency-cruiser.js").IDependency[]} an array of dependency objects (see above)
 */
export default function extractStats(
  pFileName,
  pCruiseOptions,
  pTranspileOptions,
) {
  try {
    return determineExtractionFunction(pCruiseOptions, pFileName)(
      pCruiseOptions,
      pFileName,
      pTranspileOptions,
    );
  } catch (pError) {
    throw new Error(
      `Extracting stats ran afoul of...\n\n  ${pError.message}\n... in ${pFileName}\n\n`,
    );
  }
}
