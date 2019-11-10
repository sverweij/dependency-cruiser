const mnemonic = require("mnemonic-words");
const anonymizePathElement = require("./anonymizePathElement");

const WHITELIST_RE = /^(|[.]+|~|bin|configs?|components?|fixtures?|helpers?|i18n|index\.(jsx?|tsx?|vue|coffee|ls)|lib|_?_?mocks?_?_?|node_modules|packages?|package\.json|scripts?|services?|sources?|specs?|src|_?_?tests?_?_?|types?|uti?ls?)$/;
const WORDLIST = mnemonic
  .map(pString => pString.replace(/[^a-zA-Z-]/g, "_"))
  .filter(pString => pString.match(/^[a-zA-Z-_]+$/g))
  .filter(pString => !pString.match(WHITELIST_RE));

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
 * @param {string[]} pWordList word list to pull from. By default uses a list of ~1.5k mnemonic words
 * @param {RegExp} pWhiteListRE regular expression of path elements that don't need anonymizing. Make sure it doesn't have a 'global' modifier on it.
 * @returns {string} - anonymized path
 */
module.exports = function anonymizePath(
  pPath,
  pWordList = WORDLIST,
  pWhiteListRE = WHITELIST_RE
) {
  return pPath
    .split("/")
    .map(pPathElement =>
      anonymizePathElement(pPathElement, pWordList, pWhiteListRE)
    )
    .join("/");
};
