import type { ICruiseOptions } from "../options.mjs";

/**
 * Reads the file with name `pConfigFileName` returns the parsed cruise
 * options.
 *
 * You can safely ignore the optional parameters. Simply this should work (given
 * `.dependency-cruiser.js` exists and contains a valid dependency-cruiser config)
 *
 * ```javascript
 * const depcruiseConfig = extractDepcruiseConfig("./.dependency-cruiser.js")
 * ```
 *
 * @param pConfigFileName
 * @param pAlreadyVisited
 * @param pBaseDirectory
 * @return dependency-cruiser options
 * @throws when the config is not valid (/ does not exist/ isn't readable)
 */
export default function extractDepcruiseConfig(
  pConfigFileName: string,
  pAlreadyVisited?: Set<string>,
  pBaseDirectory?: string
): Promise<ICruiseOptions>;
