import { extname, resolve as path_resolve, relative } from "node:path";
import monkeyPatchedModule from "node:module";
import { isRelativeModuleName } from "./module-classifiers.mjs";
import { resolveAMD } from "./resolve-amd.mjs";
import resolveCommonJS from "./resolve-cjs.mjs";
import { stripToModuleName, addLicenseAttribute } from "./resolve-helpers.mjs";
import determineDependencyTypes from "./determine-dependency-types.mjs";
import { getManifest } from "./get-manifest.mjs";
import pathToPosix from "#utl/path-to-posix.mjs";

/**
 *
 * @param {import("../../../types/dependency-cruiser.js").IModule} pModule
 * @param {string} pBaseDirectory
 * @param {string} pFileDirectory
 * @param {import("../../../types/dependency-cruiser.js").IResolveOptions} pResolveOptions
 * @returns {any}
 */
function resolveModule(
  pModule,
  pBaseDirectory,
  pFileDirectory,
  pResolveOptions,
) {
  let lReturnValue = null;

  const lStrippedModuleName = stripToModuleName(pModule.module);
  if (
    isRelativeModuleName(lStrippedModuleName) ||
    ["cjs", "es6", "tsd"].includes(pModule.moduleSystem)
  ) {
    lReturnValue = resolveCommonJS(
      lStrippedModuleName,
      pBaseDirectory,
      pFileDirectory,
      pResolveOptions,
    );
  } else {
    lReturnValue = resolveAMD(
      lStrippedModuleName,
      pBaseDirectory,
      pFileDirectory,
      pResolveOptions,
    );
  }
  return lReturnValue;
}

function canBeResolvedToTsVariant(pModuleName) {
  return [".js", ".jsx", ".mjs", ".cjs"].includes(extname(pModuleName));
}

function isTypeScriptIshExtension(pModuleName) {
  return [".ts", ".tsx", ".cts", ".mts"].includes(extname(pModuleName));
}
function resolveYarnVirtual(pBaseDirectory, pPath) {
  const pnpAPI = (monkeyPatchedModule?.findPnpApi ?? (() => false))(pPath);

  // the pnp api only works in plug'n play environments, and resolveVirtual
  // only under yarn(berry). As we can't run a 'regular' nodejs environment
  // and a yarn(berry) one at the same time, ignore in the test coverage and
  // cover it in a separate integration test.
  /* c8 ignore start */
  if (pnpAPI && (pnpAPI?.VERSIONS?.resolveVirtual ?? 0) === 1) {
    // resolveVirtual takes absolute paths, hence the path.resolve:
    const lResolvedAbsolute = path_resolve(pBaseDirectory, pPath);
    const lResolvedVirtual = pnpAPI.resolveVirtual(lResolvedAbsolute);
    if (lResolvedVirtual) {
      const lResolvedRelative = relative(pBaseDirectory, lResolvedVirtual);
      // in win32 environments resolveVirtual might return win32 paths,
      // so we have to convert them to posix paths again
      return pathToPosix(lResolvedRelative);
    }
  }
  /* c8 ignore stop */
  return pPath;
}

/**
 *
 * @param {string} pJavaScriptExtension
 * @returns {string}
 */
function getTypeScriptExtensionsToTry(pJavaScriptExtension) {
  const lJS2TSMap = new Map([
    [".js", [".ts", ".tsx", ".d.ts"]],
    [".jsx", [".ts", ".tsx", ".d.ts"]],
    [".cjs", [".cts", ".d.cts"]],
    [".mjs", [".mts", ".d.mts"]],
  ]);

  return lJS2TSMap.get(pJavaScriptExtension) ?? [];
}

// eslint-disable-next-line max-lines-per-function
function resolveWithRetry(
  pModule,
  pBaseDirectory,
  pFileDirectory,
  pResolveOptions,
) {
  let lReturnValue = resolveModule(
    pModule,
    pBaseDirectory,
    pFileDirectory,
    pResolveOptions,
  );
  const lStrippedModuleName = stripToModuleName(pModule.module);

  // when we feed the typescript compiler an import with an explicit .js(x) extension
  // and the .js(x) file does not exist, it tries files with the .ts, .tsx or
  // .d.ts extensions (this a.o. means ./hello.jsx can resolve to ./hello.ts and
  // ./wut.js to ./wut.tsx).
  //
  // This behavior is very specific:
  // - tsc only (doesn't work in ts-node for instance)
  // - until TypeScript 4.6 only for the .js and .jsx extensions
  // - since TypeScript 4.7 also for .cjs and .mjs (=> .cts, .mts) extensions,
  //   which work subtly different;
  //   .cjs resolves to .cts or .d.cts (in that order)
  //   .mjs resolves to .mts or .d.mts (in that order)
  // ref: https://www.typescriptlang.org/docs/handbook/esm-node.html#new-file-extensions
  //
  // Hence also this oddly specific looking check & retry.
  //
  // This should eventually probably land in either enhanced_resolve or in a
  // plugin/ extension for it (tsconfig-paths-webpack-plugin?)
  if (
    lReturnValue.couldNotResolve &&
    canBeResolvedToTsVariant(lStrippedModuleName)
  ) {
    const lModuleWithoutExtension = lStrippedModuleName.replace(
      /\.(js|jsx|cjs|mjs)$/g,
      "",
    );
    const lExtensionsToTry = getTypeScriptExtensionsToTry(
      extname(lStrippedModuleName),
    );

    const lReturnValueCandidate = resolveModule(
      { ...pModule, module: lModuleWithoutExtension },
      pBaseDirectory,
      pFileDirectory,
      { ...pResolveOptions, extensions: lExtensionsToTry },
    );

    if (isTypeScriptIshExtension(lReturnValueCandidate.resolved)) {
      lReturnValue = lReturnValueCandidate;
    }
  }
  return lReturnValue;
}

/**
 * resolves the module name of the pDependency to a file on disk.
 *
 * @param  {Partial <import("../../../types/cruise-result.mjs").IDependency>} pDependency
 * @param  {string} pBaseDirectory    the directory to consider as base (or 'root')
 *                              for resolved files.
 * @param  {string} pFileDirectory    the directory of the file the dependency was
 *                              detected in
 * @param  {import("../../../types/resolve-options.mjs").IResolveOptions} pResolveOptions
 * @param  {any} pTranspileOptions
 * @return {Partial <import("../../../types/cruise-result.mjs").IDependency>}
 *
 *
 */
// eslint-disable-next-line max-lines-per-function, max-params
export default function resolve(
  pDependency,
  pBaseDirectory,
  pFileDirectory,
  pResolveOptions,
  pTranspileOptions,
) {
  let lResolvedDependency = resolveWithRetry(
    pDependency,
    pBaseDirectory,
    pFileDirectory,
    pResolveOptions,
  );
  const lStrippedModuleName = stripToModuleName(pDependency.module);

  lResolvedDependency = {
    ...lResolvedDependency,
    ...addLicenseAttribute(
      lStrippedModuleName,
      lResolvedDependency.resolved,
      { baseDirectory: pBaseDirectory, fileDirectory: pFileDirectory },
      pResolveOptions,
    ),
    dependencyTypes: determineDependencyTypes(
      { ...pDependency, ...lResolvedDependency },
      lStrippedModuleName,
      getManifest(
        pFileDirectory,
        pBaseDirectory,
        pResolveOptions.combinedDependencies,
      ),
      pFileDirectory,
      pResolveOptions,
      pBaseDirectory,
      pTranspileOptions,
    ),
  };

  if (!lResolvedDependency.coreModule && !lResolvedDependency.couldNotResolve) {
    // enhanced-resolve inserts a NULL character in front of any `#` character.
    // This wonky replace corrects that that so the filename again corresponds
    // with a real file on disk
    const lResolvedEHRCorrected = lResolvedDependency.resolved.replace(
      // eslint-disable-next-line no-control-regex
      /\u0000#/g,
      "#",
    );
    const lResolvedYarnVirtual = resolveYarnVirtual(
      pBaseDirectory,
      lResolvedEHRCorrected,
    );

    lResolvedDependency.resolved = lResolvedYarnVirtual;
  }
  return lResolvedDependency;
}
