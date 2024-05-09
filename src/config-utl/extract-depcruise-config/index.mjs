import { dirname } from "node:path";
import readConfig from "./read-config.mjs";
import mergeConfigs from "./merge-configs.mjs";
import normalizeResolveOptions from "#main/resolve-options/normalize.mjs";
import { resolve } from "#extract/resolve/resolve.mjs";

/* eslint no-use-before-define: 0 */
async function processExtends(pReturnValue, pAlreadyVisited, pBaseDirectory) {
  let lReturnValue = structuredClone(pReturnValue);

  if (typeof lReturnValue.extends === "string") {
    lReturnValue = mergeConfigs(
      lReturnValue,
      await extractDepcruiseConfig(
        lReturnValue.extends,
        pAlreadyVisited,
        pBaseDirectory,
      ),
    );
  }

  if (Array.isArray(lReturnValue.extends)) {
    for (let lExtends of lReturnValue.extends) {
      lReturnValue = mergeConfigs(
        lReturnValue,
        // eslint-disable-next-line no-await-in-loop
        await extractDepcruiseConfig(lExtends, pAlreadyVisited, pBaseDirectory),
      );
    }
  }
  Reflect.deleteProperty(lReturnValue, "extends");
  return lReturnValue;
}

/**
 * Reads the file with name `pConfigFileName` returns the parsed cruise
 * options.
 *
 * You can safely ignore the optional parameters. This should work (given
 * `.dependency-cruiser.js` exists and contains a valid dependency-cruiser
 * config)
 *
 * ```javascript
 * const depcruiseConfig = extractDepcruiseConfig("./.dependency-cruiser.js")
 * ```
 *
 * @param {string} pConfigFileName
 * @param {Set?} pAlreadyVisited
 * @param {string?} pBaseDirectory
 * @return {import('../../../types/configuration.mjs').IConfiguration} dependency-cruiser options
 * @throws {Error} when the config is not valid (/ does not exist/ isn't readable)
 */
export default async function extractDepcruiseConfig(
  pConfigFileName,
  pAlreadyVisited = new Set(),
  pBaseDirectory = process.cwd(),
) {
  const lResolvedFileName = resolve(
    pConfigFileName,
    pBaseDirectory,
    await normalizeResolveOptions(
      {
        extensions: [".js", ".json", ".cjs", ".mjs"],
      },
      {},
    ),
    "cli",
  );
  const lBaseDirectory = dirname(lResolvedFileName);

  if (pAlreadyVisited.has(lResolvedFileName)) {
    throw new Error(
      `config is circular - ${[...pAlreadyVisited].join(
        " -> ",
      )} -> ${lResolvedFileName}.\n`,
    );
  }
  pAlreadyVisited.add(lResolvedFileName);

  let lReturnValue = await readConfig(lResolvedFileName);

  if (lReturnValue?.extends) {
    lReturnValue = await processExtends(
      lReturnValue,
      pAlreadyVisited,
      lBaseDirectory,
    );
  }

  return lReturnValue;
}
