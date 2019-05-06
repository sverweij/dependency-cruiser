const toTypescriptAST = require('./parse/toTypescriptAST');
const toJavascriptAST = require('./parse/toJavascriptAST');
const localNpmHelpers = require('./resolve/localNpmHelpers');
const readPackageDepsClearCache = require('./resolve/readPackageDeps').clearCache;
const resolveAMDClearCache = require('./resolve/resolve-AMD').clearCache;
const resolveClearCache = require('./resolve/resolve').clearCache;

module.exports = () => {
    toTypescriptAST.getASTCached.cache.clear();
    toJavascriptAST.getASTCached.cache.clear();
    localNpmHelpers.getPackageJson.cache.clear();
    readPackageDepsClearCache();
    resolveAMDClearCache();
    resolveClearCache();
};
