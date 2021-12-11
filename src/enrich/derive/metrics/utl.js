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

function object2Array(pObject) {
  return Object.keys(pObject).map((pKey) => ({
    name: pKey,
    ...pObject[pKey],
  }));
}

module.exports = {
  getParentFolders,
  object2Array,
};
