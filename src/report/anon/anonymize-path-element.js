const _memoize = require("lodash/memoize");
const randomString = require("./random-string");

function replace(pElement, pIndex, pWordList) {
  return pIndex === 0 ? pWordList.shift() || randomString(pElement) : pElement;
}

const replaceCached = _memoize(replace);

function replaceFromWordList(pPathElement, pWordList, pCached) {
  return pPathElement
    .split(".")
    .map((pElement, pIndex) =>
      pCached
        ? replaceCached(pElement, pIndex, pWordList)
        : replace(pElement, pIndex, pWordList)
    )
    .join(".");
}

/**
 * Replaces the passed pPathElement with words from the word list.
 * - If the word list is empty use a ('smart') random string (see
 *   randomString)
 * - ... but don't replace if the pPathElement matches the whitelist
 * - and only replace up until the first dot in the pattern, so
 *   extensions get
 *
 * superSecureThing.ts => abandon.ts
 * superSecureThing.spec.ts => abandon.spec.ts
 * src/index.ts => src/index.ts // 'src' and 'index' are in the whitelist
 * lib/somethingElse.service.js => lib/ability.service.js
 *
 * To make sure the same input value gets the same output on
 * consecutive calls, this function saves the (path element, result)
 * pairs in a cache. If you don't want that pass false to the pCached
 * parameter
 *
 * (note: it _removes_ elements from pWordList to prevent duplicates,
 * so if the word list is precious to you - pass a clone)
 *
 * @param {string} pPathElement the path element to anonymize
 * @param {string[]} pWordList words to pick from
 * @param {RegExp} pWhiteListRE pattern not to anonymize
 * @param {boolean} pCached caches the replaced value, with pPathElement as the key
 * @return {string} the path element, anonymized if it isn't whitelisted
 */
function anonymizePathElement(
  pPathElement,
  pWordList = [],
  pWhiteListRE = /^$/g,
  pCached = true
) {
  return pWhiteListRE.test(pPathElement)
    ? pPathElement
    : replaceFromWordList(pPathElement, pWordList, pCached);
}

module.exports = anonymizePathElement;

/**
 * Clears the path element => replaced value cache
 * Here for testing purposes.
 *
 * @returns {void}
 */
module.exports.clearCache = () => {
  replaceCached.cache.clear();
};
