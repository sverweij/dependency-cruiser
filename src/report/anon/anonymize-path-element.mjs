import randomString from "./random-string.mjs";

const ALREADY_USED_WORDS = new Map();

function replace(pElement, pIndex, pWordList) {
  return pIndex === 0 ? pWordList.shift() || randomString(pElement) : pElement;
}

function replaceCached(pElement, pIndex, pWordList) {
  if (ALREADY_USED_WORDS.has(pElement)) {
    return ALREADY_USED_WORDS.get(pElement);
  }
  const lReplaced = replace(pElement, pIndex, pWordList);
  ALREADY_USED_WORDS.set(pElement, lReplaced);
  return lReplaced;
}

function replaceFromWordList(pPathElement, pWordList, pCached) {
  return pPathElement
    .split(".")
    .map((pElement, pIndex) =>
      pCached
        ? replaceCached(pElement, pIndex, pWordList)
        : replace(pElement, pIndex, pWordList),
    )
    .join(".");
}

/**
 * replaces pPathElement with a word from pWordList
 *
 * note: _mutates_ the wordlist to avoid using the same word > 1x
 *
 * See ./anonymize-path-element.md for details
 *
 * @param {string} pPathElement the path element to anonymize
 * @param {string[]} pWordList words to pick from
 * @param {RegExp} pWhiteListRE pattern not to anonymize
 * @param {boolean} pCached caches the replaced value, with pPathElement as the key
 * @return {string} the path element, anonymized if it isn't whitelisted
 */
export function anonymizePathElement(
  pPathElement,
  pWordList = [],
  pWhiteListRE = /^$/,
  pCached = true,
) {
  return pWhiteListRE.test(pPathElement)
    ? pPathElement
    : replaceFromWordList(pPathElement, pWordList, pCached);
}

/**
 * Clears the path element => replaced value cache
 * Here for testing purposes.
 *
 * @returns {void}
 */
export function clearCache() {
  ALREADY_USED_WORDS.clear();
}
