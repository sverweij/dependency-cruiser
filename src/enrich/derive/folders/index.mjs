import aggregateToFolders from "./aggregate-to-folders.mjs";
import validate from "#validate/index.mjs";

/**
 * @param {import("../../../../types/dependency-cruiser.js").IFolder} pFolder
 * @param {import('../../../../types/dependency-cruiser.js').IOptions} pOptions
 * @returns
 */
function validateFolderDependency(pFolder, pOptions) {
  return (pDependency) => ({
    ...pDependency,
    ...validate.folder(pOptions.ruleSet || {}, pFolder, pDependency),
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
 * @param {import('../../../../types/dependency-cruiser.js').IModule[]} pModules
 * @param {import('../../../../types/dependency-cruiser.js').IOptions} pOptions
 * @returns {any}
 */
export default function deriveFolderMetrics(pModules, pOptions) {
  let lReturnValue = {};
  if (pOptions.metrics) {
    lReturnValue = {
      folders: aggregateToFolders(pModules).map(
        addFolderDependencyViolations(pOptions),
      ),
    };
  }
  return lReturnValue;
}
