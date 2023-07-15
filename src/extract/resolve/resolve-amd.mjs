import { accessSync, R_OK } from "node:fs";
import { relative, join } from "node:path";
import { builtinModules } from "node:module";
import memoize from "lodash/memoize.js";
import pathToPosix from "../../utl/path-to-posix.mjs";

// builtinModules does not expose all builtin modules for #reasons -
// see https://github.com/nodejs/node/issues/42785. In stead we could use
// isBuiltin, but that is not available in node 16.14, the lowest version
// of node dependency-cruiser currently supports. So we add the missing
// modules here.
// b.t.w. code is duplicated in resolve-cjs.mjs
const REALLY_BUILTIN_MODULES = builtinModules.concat(["test", "node:test"]);

const fileExists = memoize((pFile) => {
  try {
    accessSync(pFile, R_OK);
  } catch (pError) {
    return false;
  }

  return true;
});

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
    coreModule: REALLY_BUILTIN_MODULES.includes(pStrippedModuleName),
    followable: fileExists(lResolvedPath) && lResolvedPath.endsWith(".js"),
    couldNotResolve:
      !REALLY_BUILTIN_MODULES.includes(pStrippedModuleName) &&
      !fileExists(lResolvedPath),
  };
}

export function clearCache() {
  fileExists.cache.clear();
}
