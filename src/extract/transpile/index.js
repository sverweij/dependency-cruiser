"use strict";

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
 * @param  {string} pExtension extension of the file to transpile
 * @param  {string} pFile      the contents of the file to transpile
 * @return {string}            the transpiled version of the file (or the file
 *                             itself when the function could not find a
 *                             transpiler matching pExtension
 */
module.exports = (pExtension, pFile) => {
    const lWrapper = meta.getWrapper(pExtension);

    if (lWrapper.isAvailable()) {
        return lWrapper.transpile(pFile);
    } else {
        return pFile;
    }
};
