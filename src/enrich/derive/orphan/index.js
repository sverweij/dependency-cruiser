const isOrphan = require("./is-orphan");

module.exports = function deriveOrphans(pModules) {
  return pModules.map((pModule) => ({
    ...pModule,
    orphan: isOrphan(pModule, pModules),
  }));
};
