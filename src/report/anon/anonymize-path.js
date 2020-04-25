const anonymizePathElement = require("./anonymize-path-element");

const WHITELIST_RE = /^(|[.]+|~|bin|app|cli|src|configs?|components?|fixtures?|helpers?|i18n|index\.(jsx?|tsx?|vue|coffee|ls)|lib|_?_?mocks?_?_?|node_modules|packages?|package\.json|scripts?|services?|sources?|specs?|_?_?tests?_?_?|types?|uti?ls?)$/;

/**
 * Kind of smartly anonymizes paths, by
 * - replacing elements in the path with words from a random word list
 * - ... when that's exhausted by random strings
 * - path elements matching the passed whitelist regex are left alone
 *   (so things like src, bin, tests etc are still recognizable)
 *
 * The list of words is currently _assumed_ to (1) be unique and
 * (2) not contain words that match the white list regex
 *
 * @param {string} pPath path to anonymize
 * @param {string[]} pWordList word list to pull from. By default uses an empty list
 * @param {RegExp} pWhiteListRE regular expression of path elements that don't need
 *                              anonymizing. Make sure it doesn't have a 'global'
 *                              modifier on it.
 * @returns {string} - anonymized path
 */
module.exports = function anonymizePath(
  pPath,
  pWordList = [],
  pWhiteListRE = WHITELIST_RE
) {
  return pPath
    .split("/")
    .map((pPathElement) =>
      anonymizePathElement(pPathElement, pWordList, pWhiteListRE)
    )
    .join("/");
};

module.exports.WHITELIST_RE = WHITELIST_RE;
