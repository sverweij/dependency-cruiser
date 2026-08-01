import type { ICruiseOptions } from "../options.mjs";

/**
 * Reads the file with name `pConfigFileName` returns the parsed cruise
 * options you can use as
 *
 * ```javascript
 * const depcruiseOptions = await extractDepcruiseOptions("./.dependency-cruiser.js")
 * const cruiseResult = await cruise(["./src"], depcruiseOptions);
 * ```
 *
 * @param pConfigFileName
 * @returns dependency-cruiser options
 * @throws when the config is not valid (/ does not exist/ isn't readable)
 */
export default function extractDepcruiseOptions(
  pConfigFileName: string,
): Promise<ICruiseOptions>;
