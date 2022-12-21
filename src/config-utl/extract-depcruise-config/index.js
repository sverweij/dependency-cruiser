const path = require("path");
const cloneDeep = require("lodash/cloneDeep");
const has = require("lodash/has");
const resolve = require("../../extract/resolve/resolve");
const normalizeResolveOptions = require("../../main/resolve-options/normalize");
const readConfig = require("./read-config");
const mergeConfigs = require("./merge-configs");

/* eslint no-use-before-define: 0 */
function processExtends(pReturnValue, pAlreadyVisited, pBaseDirectory) {
  let lReturnValue = cloneDeep(pReturnValue);

  if (typeof lReturnValue.extends === "string") {
    lReturnValue = mergeConfigs(
      lReturnValue,
      extractDepcruiseConfig(
        lReturnValue.extends,
        pAlreadyVisited,
        pBaseDirectory
      )
    );
  }

  if (Array.isArray(lReturnValue.extends)) {
    lReturnValue = lReturnValue.extends.reduce(
      (pAll, pExtends) =>
        mergeConfigs(
          pAll,
          extractDepcruiseConfig(pExtends, pAlreadyVisited, pBaseDirectory)
        ),
      lReturnValue
    );
  }
  Reflect.deleteProperty(lReturnValue, "extends");
  return lReturnValue;
}

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
 * @param {string} pConfigFileName
 * @param {Set?} pAlreadyVisited
 * @param {string?} pBaseDirectory
 * @return {import('../../../types/options').ICruiseOptions} dependency-cruiser options
 * @throws {Error} when the config is not valid (/ does not exist/ isn't readable)
 */
function extractDepcruiseConfig(
  pConfigFileName,
  pAlreadyVisited = new Set(),
  pBaseDirectory = process.cwd()
) {
  const lResolvedFileName = resolve(
    pConfigFileName,
    pBaseDirectory,
    normalizeResolveOptions(
      {
        extensions: [".js", ".json", ".cjs"],
      },
      {}
    ),
    "cli"
  );
  const lBaseDirectory = path.dirname(lResolvedFileName);

  if (pAlreadyVisited.has(lResolvedFileName)) {
    throw new Error(
      `config is circular - ${[...pAlreadyVisited].join(
        " -> "
      )} -> ${lResolvedFileName}.\n`
    );
  }
  pAlreadyVisited.add(lResolvedFileName);

  let lReturnValue = readConfig(lResolvedFileName, pBaseDirectory);

  if (has(lReturnValue, "extends")) {
    lReturnValue = processExtends(
      lReturnValue,
      pAlreadyVisited,
      lBaseDirectory
    );
  }

  return lReturnValue;
}

module.exports = extractDepcruiseConfig;
