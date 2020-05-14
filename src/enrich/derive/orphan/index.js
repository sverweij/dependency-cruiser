const isOrphan = require("./is-orphan");

module.exports = (pModules) =>
  pModules.map((pNode) => ({
    ...pNode,
    orphan: isOrphan(pNode, pModules),
  }));
