import type { IConfiguration } from "../configuration.mjs";

/**
 * Reads the file with name `pConfigFileName` returns the parsed cruise
 * configuration. If you're  looking for the function to read a
 * dependency-cruiser configuration file and put the result into the `cruise`
 * function use `extractDepcruiseOptions` instead.s
 *
 * You can safely ignore the optional parameters. This should work (given
 * `.dependency-cruiser.js` exists and contains a valid dependency-cruiser
 * config)
 *
 * ```javascript
 * const depcruiseConfig = await extractDepcruiseConfig("./.dependency-cruiser.js")
 * ```
 *
 * @param pConfigFileName
 * @param pAlreadyVisited
 * @param pBaseDirectory
 * @return dependency-cruiser configuration
 * @throws when the config is not valid (/ does not exist/ isn't readable)
 */
export default function extractDepcruiseConfig(
  pConfigFileName: string,
  pAlreadyVisited?: Set<string>,
  pBaseDirectory?: string,
): Promise<IConfiguration>;
