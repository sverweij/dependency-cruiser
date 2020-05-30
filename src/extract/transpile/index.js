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
 * @param  {any} pTranspilerOptions (optional) object with options influencing
 *                                the underlying transpiler behavior.
 * @return {string}               the transpiled version of the file (or the file
 *                                itself when the function could not find a
 *                                transpiler matching pExtension
 */
module.exports = (pExtension, pSource, pTranspilerOptions) => {
  const lWrapper = meta.getWrapper(pExtension, pTranspilerOptions);

  if (lWrapper.isAvailable()) {
    return lWrapper.transpile(pSource, pTranspilerOptions);
  } else {
    return pSource;
  }
};
