/* eslint-disable security/detect-object-injection */
function getParentFolders(pPath) {
  let lFragments = pPath.split("/");
  let lReturnValue = [];

  while (lFragments.length > 0) {
    lReturnValue.push(lFragments.join("/"));
    lFragments.pop();
  }
  return lReturnValue.reverse();
}

function foldersObject2folderArray(pObject) {
  return Object.keys(pObject).map((pKey) => ({
    name: pKey,
    ...pObject[pKey],
  }));
}

function shouldDeriveMetrics(pOptions) {
  return pOptions.metrics || pOptions.outputType === "metrics";
}

module.exports = {
  getParentFolders,
  foldersObject2folderArray,
  shouldDeriveMetrics,
};
