import path from "path";
import { builtinModules } from "module";
import pathToPosix from "../../utl/path-to-posix.js";
import moduleClassifiers from "./module-classifiers.mjs";
import { resolve } from "./resolve.mjs";

const { isFollowable } = moduleClassifiers;

function addResolutionAttributes(
  pBaseDirectory,
  pModuleName,
  pFileDirectory,
  pResolveOptions
) {
  let lReturnValue = {};

  if (builtinModules.includes(pModuleName)) {
    lReturnValue.coreModule = true;
  } else {
    try {
      lReturnValue.resolved = pathToPosix(
        path.relative(
          pBaseDirectory,
          resolve(pModuleName, pFileDirectory, pResolveOptions)
        )
      );
      lReturnValue.followable = isFollowable(
        lReturnValue.resolved,
        pResolveOptions
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
  pResolveOptions
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
      pResolveOptions
    ),
  };
}
