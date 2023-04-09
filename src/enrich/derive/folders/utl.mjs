/* eslint-disable security/detect-object-injection */
import path from "node:path/posix";

export function findFolderByName(pAllFolders, pName) {
  return pAllFolders.find((pFolder) => pFolder.name === pName);
}

export function getAfferentCouplings(pModule, pDirname) {
  return pModule.dependents.filter(
    (pDependent) => !pDependent.startsWith(pDirname.concat(path.sep))
  );
}

export function getEfferentCouplings(pModule, pDirname) {
  return pModule.dependencies.filter(
    (pDependency) => !pDependency.resolved.startsWith(pDirname.concat(path.sep))
  );
}

/**
 *
 * @param {string} pPath
 * @returns string[]
 */
export function getParentFolders(pPath) {
  let lFragments = pPath.split("/");
  let lReturnValue = [];

  while (lFragments.length > 0) {
    lReturnValue.push(lFragments.join("/"));
    lFragments.pop();
  }
  return lReturnValue.reverse();
}

export function object2Array(pObject) {
  return Object.keys(pObject).map((pKey) => ({
    name: pKey,
    ...pObject[pKey],
  }));
}
