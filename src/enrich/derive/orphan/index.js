const isOrphan = require("./is-orphan");

module.exports = (pModules) =>
  pModules.map((pModule) => ({
    ...pModule,
    orphan: isOrphan(pModule, pModules),
  }));
