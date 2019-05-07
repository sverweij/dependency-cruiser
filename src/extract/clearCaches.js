const toTypescriptAST = require('./parse/toTypescriptAST');
const toJavascriptAST = require('./parse/toJavascriptAST');
const localNpmHelpers = require('./resolve/localNpmHelpers');
const readPackageDeps = require('./resolve/readPackageDeps');
const resolveAMD      = require('./resolve/resolve-AMD');
const resolve         = require('./resolve/resolve');

module.exports = () => {
    toTypescriptAST.clearCache();
    toJavascriptAST.clearCache();
    localNpmHelpers.clearCache();
    readPackageDeps.clearCache();
    resolveAMD.clearCache();
    resolve.clearCache();
};
