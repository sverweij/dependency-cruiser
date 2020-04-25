const path = require("path");
const resolve = require("../../extract/resolve/resolve");
const normalizeResolveOptions = require("../../main/resolve-options/normalize");
const readConfig = require("./read-config");
const mergeConfigs = require("./merge-configs");

/* eslint no-use-before-define: 0 */
function processExtends(pReturnValue, pAlreadyVisited, pBaseDirectory) {
  if (typeof pReturnValue.extends === "string") {
    pReturnValue = mergeConfigs(
      pReturnValue,
      compileConfig(pReturnValue.extends, pAlreadyVisited, pBaseDirectory)
    );
  }

  if (Array.isArray(pReturnValue.extends)) {
    pReturnValue = pReturnValue.extends.reduce(
      (pAll, pExtends) =>
        mergeConfigs(
          pAll,
          compileConfig(pExtends, pAlreadyVisited, pBaseDirectory)
        ),
      pReturnValue
    );
  }
  Reflect.deleteProperty(pReturnValue, "extends");
  return pReturnValue;
}

function getRunningProcessResolutionStrategy() {
  // This should work, but doesn't:
  // process.versions.pnp ? "yarn-pnp" : "node_modules";

  // "yarn-pnp" works both for the pnp and for the node_modules strategies,
  // and because it's only for the config it won't hamper performance
  // (should typically be 0 - 2 calls for an entire run)
  return "yarn-pnp";
}

function compileConfig(
  pConfigFileName,
  pAlreadyVisited = new Set(),
  pBaseDirectory = process.cwd()
) {
  const lResolvedFileName = resolve(
    pConfigFileName,
    pBaseDirectory,
    normalizeResolveOptions(
      {
        extensions: [".js", ".json"],
      },
      {
        externalModuleResolutionStrategy: getRunningProcessResolutionStrategy(),
      }
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

  if (Object.prototype.hasOwnProperty.call(lReturnValue, "extends")) {
    lReturnValue = processExtends(
      lReturnValue,
      pAlreadyVisited,
      lBaseDirectory
    );
  }

  return lReturnValue;
}

module.exports = compileConfig;
