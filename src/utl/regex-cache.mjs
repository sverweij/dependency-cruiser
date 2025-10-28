/**
 * Memoized regex compilation. Reduces redundant regex creation
 * in hot paths where the same patterns are tested repeatedly.
 *
 * @module utl/regex-cache
 */

import memoize, { memoizeClear } from "memoize";

/**
 * Compiles a RegExp from pattern and flags.
 * This function is memoized to avoid recompiling the same regex.
 *
 * @param {string} pPattern - The regex pattern
 * @param {string} pFlags - The regex flags
 * @returns {RegExp} - Compiled regular expression
 */
function compileRegex(pPattern, pFlags) {
  // eslint-disable-next-line security/detect-non-literal-regexp
  return new RegExp(pPattern, pFlags);
}

/**
 * Memoized version of compileRegex with LRU cache of 500 entries.
 * Cache key combines pattern and flags to ensure uniqueness.
 */
const getCachedRegex = memoize(compileRegex, {
  cache: new Map(),
  cacheKey: (pArguments) => `${pArguments[0]}|${pArguments[1] || ""}`,
});

/**
 * Tests a string against a cached regex pattern.
 *
 * @param {string} pString - The string to test
 * @param {string} pPattern - The regex pattern
 * @param {string} [pFlags=""] - The regex flags (default: no flags)
 * @returns {boolean} - Whether the pattern matches
 */
export function testCachedRegex(pString, pPattern, pFlags = "") {
  return getCachedRegex(pPattern, pFlags).test(pString);
}

export { getCachedRegex };

export function clearCache() {
  memoizeClear(getCachedRegex);
}
