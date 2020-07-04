const { builtinModules } = require("module");

module.exports = (pModuleName) =>
  builtinModules.some((pBuiltinModule) => pBuiltinModule === pModuleName);
