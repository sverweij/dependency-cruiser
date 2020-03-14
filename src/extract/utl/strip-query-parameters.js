/**
 * returns pFilenameString stripped of any 'query parameters' e.g.
 *
 * "hello/there?thing=smurf" => "hello/there"
 * "boink/boink/t.gif?resource" => "boink/boink/t.gif"
 * "no/thing/after.js" => "no/thing/after.js"
 *
 * @param {string} pFilenameString string to strip the query parameters from
 * @returns {string} the stripped string
 */
module.exports = function stripQueryParameters(pFilenameString) {
  // url.parse(pFilenameString).pathname did this quite admirably, but it's
  // deprecated, hence this fonky RE replace. And accompanying unit test :-/
  return pFilenameString.replace(/\?.+$/, "");
};
