const _memoize = require("lodash/memoize");

function bareFindModuleByName(pGraph, pSource) {
  return pGraph.find((pNode) => pNode.source === pSource);
}

const findModuleByName = _memoize(
  bareFindModuleByName,
  (_pGraph, pSource) => pSource
);

module.exports = findModuleByName;

module.exports.clearCache = () => {
  findModuleByName.cache.clear();
};
