/* eslint-disable security/detect-object-injection */
const path = require("path").posix;

function findFolderByName(pAllFolders, pName) {
  return pAllFolders.find((pFolder) => pFolder.name === pName);
}

function getAfferentCouplings(pModule, pDirname) {
  return pModule.dependents.filter(
    (pDependent) => !pDependent.startsWith(pDirname.concat(path.sep))
  );
}

function getEfferentCouplings(pModule, pDirname) {
  return pModule.dependencies.filter(
    (pDependency) => !pDependency.resolved.startsWith(pDirname.concat(path.sep))
  );
}

/**
 *
 * @param {string} pPath
 * @returns string[]
 */
function getParentFolders(pPath) {
  let lFragments = pPath.split("/");
  let lReturnValue = [];

  while (lFragments.length > 0) {
    lReturnValue.push(lFragments.join("/"));
    lFragments.pop();
  }
  return lReturnValue.reverse();
}

function object2Array(pObject) {
  return Object.keys(pObject).map((pKey) => ({
    name: pKey,
    ...pObject[pKey],
  }));
}

module.exports = {
  findFolderByName,
  getAfferentCouplings,
  getEfferentCouplings,
  getParentFolders,
  object2Array,
};
