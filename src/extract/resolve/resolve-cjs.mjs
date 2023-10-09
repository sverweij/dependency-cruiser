import { relative } from "node:path";
import { isFollowable } from "./module-classifiers.mjs";
import { resolve } from "./resolve.mjs";
import { isBuiltin } from "./is-built-in.mjs";
import pathToPosix from "#utl/path-to-posix.mjs";

function addResolutionAttributes(
  pBaseDirectory,
  pModuleName,
  pFileDirectory,
  pResolveOptions,
) {
  let lReturnValue = {};

  if (isBuiltin(pModuleName, pResolveOptions)) {
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
