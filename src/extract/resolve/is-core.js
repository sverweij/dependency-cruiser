const builtinModules = require("module").builtinModules;

module.exports = pModuleName =>
  builtinModules.some(pBuiltinModule => pBuiltinModule === pModuleName);
