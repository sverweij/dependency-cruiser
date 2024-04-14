import { anonymizePathElement } from "./anonymize-path-element.mjs";

export const WHITELIST_RE =
  // eslint-disable-next-line security/detect-unsafe-regex
  /^(?:|[.]+|~|bin|apps?|cli|src|libs?|configs?|components?|fixtures?|helpers?|i18n|index\.(?:jsx?|[mc]js|d\.ts|tsx?|vue|coffee|ls)|_?_?mocks?_?_?|node_modules|packages?|package\.json|scripts?|services?|sources?|specs?|_?_?tests?_?_?|types?|uti?ls?|tools)$/;

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
export function anonymizePath(
  pPath,
  pWordList = [],
  pWhiteListRE = WHITELIST_RE,
) {
  return pPath
    .split("/")
    .map((pPathElement) =>
      anonymizePathElement(pPathElement, pWordList, pWhiteListRE),
    )
    .join("/");
}
