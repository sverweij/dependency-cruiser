const { builtinModules } = require("module");

module.exports = function isCore(pModuleName) {
  return builtinModules.includes(pModuleName);
};
