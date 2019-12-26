const isOrphan = require("./isOrphan");

module.exports = pModules =>
  pModules.map(pNode => ({
    ...pNode,
    orphan: isOrphan(pNode, pModules)
  }));
