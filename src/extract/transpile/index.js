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
 * @param  {any} pFileRecord      Record with source code, an extension and a filename
 * @param  {any} pTranspilerOptions (optional) object with options influencing
 *                                the underlying transpiler behavior.
 * @return {string}               the transpiled version of the file (or the file
 *                                itself when the function could not find a
 *                                transpiler matching pExtension
 */
module.exports = function transpile(
  { extension, source, filename },
  pTranspilerOptions
) {
  const lWrapper = meta.getWrapper(extension, pTranspilerOptions);

  if (lWrapper.isAvailable()) {
    return lWrapper.transpile(source, filename, pTranspilerOptions);
  } else {
    return source;
  }
};
