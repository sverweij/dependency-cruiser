/* eslint-disable security/detect-object-injection */

/**
 * Given a module string returns in an object
 * - the module name
 * - the protocol (when encoded in the string)
 * - the mimeType (when encoded in the string)
 *
 * See https://nodejs.org/api/esm.html#esm_urls
 *
 * would've loved to use url.URL here, but that doesn't extract the mime type
 * (if there's a default node API that does this I'm all ears)
 *
 * @param {string} pString
 * @returns {any}
 */
module.exports = function extractModuleAttributes(pString) {
  let lReturnValue = { module: pString };
  const lModuleAttributes = pString.match(
    // eslint-disable-next-line security/detect-unsafe-regex, unicorn/no-unsafe-regex
    /^(node:|file:|data:)?(([^,]+),)?(.+)$/
  );
  const lProtocolPosition = 1;
  const lMimeTypePosition = 3;
  const lModulePosition = 4;

  if (lModuleAttributes) {
    lReturnValue.module = lModuleAttributes[lModulePosition];
    if (lModuleAttributes[lProtocolPosition]) {
      lReturnValue.protocol = lModuleAttributes[lProtocolPosition];
    }
    if (lModuleAttributes[lMimeTypePosition]) {
      lReturnValue.mimeType = lModuleAttributes[lMimeTypePosition];
    }
  }
  return lReturnValue;
};
