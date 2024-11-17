import {
  getSourceFolderCandidates,
  getTestFolderCandidates,
  hasTestsWithinSource,
  toSourceLocationArray,
} from "./environment-helpers.mjs";
import findExtensions from "./find-extensions.mjs";
import meta from "#meta.cjs";

/**
 * @import { IInitConfig, IPartialInitConfig } from "./types.js";
 */

/**
 * @param {IInitConfig} pInitOptions
 * @param {string[]} pExtensions
 * @returns {boolean}
 */
function usesTypeScript(pInitOptions, pExtensions) {
  return Boolean(
    pInitOptions.tsConfig ||
      pInitOptions.tsPreCompilationDeps ||
      (pExtensions || []).some((pExtension) =>
        [".ts", ".tsx", ".d.ts", ".mts", ".d.mts", ".cts", ".d.cts"].includes(
          pExtension,
        ),
      ),
  );
}

/**
 * @param {IInitConfig} pInitOptions
 * @returns {string[]}
 */
function getExtensions(pInitOptions) {
  let lFoldersToScan = pInitOptions.sourceLocation;

  if (pInitOptions.hasTestsOutsideSource) {
    lFoldersToScan = lFoldersToScan.concat(pInitOptions.testLocation);
  }
  return findExtensions(lFoldersToScan.length > 0 ? lFoldersToScan : ["."]);
}

/**
 * @param {IPartialInitConfig} pInitOptions
 * @return {IPartialInitConfig}
 */
function populate(pInitOptions) {
  const lReturnValue = {
    version: meta.version,
    date: new Date().toJSON(),
    ...pInitOptions,
    sourceLocation: toSourceLocationArray(
      pInitOptions.sourceLocation || getSourceFolderCandidates(),
    ),
    testLocation: pInitOptions.isMonoRepo
      ? []
      : toSourceLocationArray(
          pInitOptions.testLocation || getTestFolderCandidates(),
        ),
  };
  const lExtensions = getExtensions(lReturnValue);
  lReturnValue.usesTypeScript = usesTypeScript(pInitOptions, lExtensions);

  if (lReturnValue.specifyResolutionExtensions) {
    lReturnValue.resolutionExtensions = lExtensions;
  }
  return lReturnValue;
}

/**
 *
 * @param {IPartialInitConfig} pInitOptions
 * @return {IInitConfig}
 */
export default function normalizeInitOptions(pInitOptions) {
  let lReturnValue = populate(pInitOptions);
  if (!Object.hasOwn(lReturnValue, "hasTestsOutsideSource")) {
    lReturnValue.hasTestsOutsideSource =
      !pInitOptions.isMonoRepo &&
      !hasTestsWithinSource(
        lReturnValue.testLocation,
        lReturnValue.sourceLocation,
      );
  }
  return lReturnValue;
}
