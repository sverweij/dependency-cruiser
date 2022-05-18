const validate = require("../../../validate");
const aggregateToFolders = require("./aggregate-to-folders");

/**
 *
 * @param {*} pFolder
 * @param {import('../../../../types/dependency-cruiser').IOptions} pOptions
 * @returns
 */
function validateFolderDependency(pFolder, pOptions) {
  return (pDependency) => {
    return {
      ...pDependency,
      ...validate.folder(pOptions.ruleSet || {}, pFolder, pDependency),
    };
  };
}

function addFolderDependencyViolations(pOptions) {
  return (pFolder) => {
    return {
      ...pFolder,
      dependencies: pFolder.dependencies.map(
        validateFolderDependency(pFolder, pOptions)
      ),
    };
  };
}

/**
 *
 * @param {import('../../../../types/dependency-cruiser').IModule[]} pModules
 * @param {import('../../../../types/dependency-cruiser').IOptions} pOptions
 * @returns {any}
 */
module.exports = function deriveFolderMetrics(pModules, pOptions) {
  let lReturnValue = {};
  if (pOptions.metrics) {
    lReturnValue = {
      folders: aggregateToFolders(pModules).map(
        addFolderDependencyViolations(pOptions)
      ),
    };
  }
  return lReturnValue;
};
