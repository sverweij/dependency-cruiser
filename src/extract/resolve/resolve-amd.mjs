import { accessSync, constants } from "node:fs";
import { relative, join } from "node:path";
import { isBuiltin } from "./is-built-in.mjs";
import pathToPosix from "#utl/path-to-posix.mjs";

const FILE_EXISTENCE_CACHE = new Map();
const fileExists = (pFile) => {
  if (FILE_EXISTENCE_CACHE.has(pFile)) {
    return FILE_EXISTENCE_CACHE.get(pFile);
  }

  try {
    accessSync(pFile, constants.R_OK);
  } catch (pError) {
    FILE_EXISTENCE_CACHE.set(pFile, false);
    return false;
  }
  FILE_EXISTENCE_CACHE.set(pFile, true);
  return true;
};

function guessPath(pBaseDirectory, pFileDirectory, pStrippedModuleName) {
  return pathToPosix(
    relative(pBaseDirectory, join(pFileDirectory, pStrippedModuleName)),
  );
}

function guessLikelyPath(pBaseDirectory, pFileDirectory, pStrippedModuleName) {
  return (
    [".js", ""]
      .map((pExtension) =>
        guessPath(
          pBaseDirectory,
          pFileDirectory,
          `${pStrippedModuleName}${pExtension}`,
        ),
      )
      .find(fileExists) || pStrippedModuleName
  );
}

export function resolveAMD(
  pStrippedModuleName,
  pBaseDirectory,
  pFileDirectory,
  pResolveOptions,
) {
  // lookups:
  // - [x] could be relative in the end (implemented)
  // - [ ] require.config kerfuffle (command line, html, file, ...)
  // - [ ] maybe use mrjoelkemp/module-lookup-amd ?
  // - [ ] or https://github.com/jaredhanson/amd-resolve ?
  // - [x] funky plugins (json!wappie, ./screeching-cat!sabertooth)
  const lResolvedPath = guessLikelyPath(
    pBaseDirectory,
    pFileDirectory,
    pStrippedModuleName,
  );

  return {
    resolved: lResolvedPath,
    coreModule: isBuiltin(pStrippedModuleName, pResolveOptions),
    followable: fileExists(lResolvedPath) && lResolvedPath.endsWith(".js"),
    couldNotResolve:
      !isBuiltin(pStrippedModuleName, pResolveOptions) &&
      !fileExists(lResolvedPath),
  };
}

export function clearCache() {
  FILE_EXISTENCE_CACHE.clear();
}
