const meta = require("./meta");

/**
 * Transpiles the string pFile with the transpiler configured for extension
 * pExtension (e.g. for extension ".ts" transpiles ) - if a supported version
 * for it is available.
 *
 * Returns the string pFile in all other cases
 *
 * @see section "supportedTranspilers" in [package.json](../../../package.json)
 *      for supported versions of transpilers
 * @see [meta.js](meta.js) for the extension -> transpiler mapping
 *
 * @param  {string} pExtension    extension of the file to transpile
 * @param  {string} pSource       the contents of the file to transpile
 * @param  {any} pTSConfig (optional) object with options influencing
 *                                the underlying transpiler behavior. Currently
 *                                only passed to the typescript transpiler
 * @return {string}               the transpiled version of the file (or the file
 *                                itself when the function could not find a
 *                                transpiler matching pExtension
 */
module.exports = (pExtension, pSource, pTSConfig) => {
    const lWrapper = meta.getWrapper(pExtension);

    if (lWrapper.isAvailable()) {
        return lWrapper.transpile(pSource, pTSConfig);
    } else {
        return pSource;
    }
};
