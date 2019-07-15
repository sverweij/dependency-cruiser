// const builtinModules = require('module').builtinModules;
const resolve = require('resolve');

module.exports = resolve.isCore;
// module.exports = (pModuleName) => builtinModules.some(pBuiltinModule => pBuiltinModule === pModuleName);
