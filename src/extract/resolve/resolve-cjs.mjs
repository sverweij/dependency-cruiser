import { relative } from "node:path";
import { builtinModules } from "node:module";
import pathToPosix from "../../utl/path-to-posix.mjs";
import { isFollowable } from "./module-classifiers.mjs";
import { resolve } from "./resolve.mjs";

// builtinModules does not expose all builtin modules for #reasons -
// see https://github.com/nodejs/node/issues/42785. In stead we could use
// isBuiltin, but that is not available in node 16.14, the lowest version
// of node dependency-cruiser currently supports. So we add the missing
// modules here.
// b.t.w. code is duplicated in resolve-amd.mjs
const REALLY_BUILTIN_MODULES = builtinModules.concat(["test", "node:test"]);

function addResolutionAttributes(
  pBaseDirectory,
  pModuleName,
  pFileDirectory,
  pResolveOptions,
) {
  let lReturnValue = {};

  if (REALLY_BUILTIN_MODULES.includes(pModuleName)) {
    lReturnValue.coreModule = true;
  } else {
    try {
      lReturnValue.resolved = pathToPosix(
        relative(
          pBaseDirectory,
          resolve(pModuleName, pFileDirectory, pResolveOptions),
        ),
      );
      lReturnValue.followable = isFollowable(
        lReturnValue.resolved,
        pResolveOptions,
      );
    } catch (pError) {
      lReturnValue.couldNotResolve = true;
    }
  }
  return lReturnValue;
}

/*
 * resolves both CommonJS and ES6
 */
export default function resolveCommonJS(
  pStrippedModuleName,
  pBaseDirectory,
  pFileDirectory,
  pResolveOptions,
) {
  return {
    resolved: pStrippedModuleName,
    coreModule: false,
    followable: false,
    couldNotResolve: false,
    ...addResolutionAttributes(
      pBaseDirectory,
      pStrippedModuleName,
      pFileDirectory,
      pResolveOptions,
    ),
  };
}
