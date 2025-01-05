import aggregateToFolders from "./aggregate-to-folders.mjs";
import { validateFolder } from "#validate/index.mjs";

/**
 * @param {import("../../../../types/dependency-cruiser.mjs").IFolder} pFolder
 * @param {import('../../../../types/dependency-cruiser.mjs').IOptions} pOptions
 * @returns
 */
function validateFolderDependency(pFolder, pOptions) {
  return (pDependency) => ({
    ...pDependency,
    ...validateFolder(pOptions.ruleSet || {}, pFolder, pDependency),
  });
}

function addFolderDependencyViolations(pOptions) {
  return (pFolder) => ({
    ...pFolder,

    dependencies: pFolder.dependencies.map(
      validateFolderDependency(pFolder, pOptions),
    ),
  });
}

/**
 *
 * @param {import('../../../../types/dependency-cruiser.mjs').IModule[]} pModules
 * @param {import('../../../../types/dependency-cruiser.mjs').IOptions} pOptions
 * @returns {any}
 */
export default function deriveFolderMetrics(pModules, pOptions) {
  let lReturnValue = {};
  if (pOptions.metrics) {
    lReturnValue = {
      folders: aggregateToFolders(pModules, pOptions).map(
        addFolderDependencyViolations(pOptions),
      ),
    };
  }
  return lReturnValue;
}
