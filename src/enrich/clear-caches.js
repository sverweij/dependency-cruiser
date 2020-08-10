const findModuleByName = require("./derive/find-module-by-name");

module.exports = function clearCaches() {
  findModuleByName.clearCache();
};
