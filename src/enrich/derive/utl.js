const _memoize = require("lodash/memoize");

function bareFindModuleByName(pGraph, pSource) {
  return pGraph.find((pNode) => pNode.source === pSource);
}

const findModuleByName = _memoize(
  bareFindModuleByName,
  (_pGraph, pSource) => pSource
);

function isDependent(pResolvedName) {
  return (pModule) =>
    pModule.dependencies.some(
      (pDependency) => pDependency.resolved === pResolvedName
    );
}

function clearCache() {
  findModuleByName.cache.clear();
}

module.exports = { findModuleByName, clearCache, isDependent };
