/**
 * If there is at least one group expression in the given pRulePath
 * return the first matched one.
 *
 * Return null in all other cases.
 *
 * This fills our current need. Later we can expand it to return all group
 * matches.
 *
 * @param {import("../../types/rule-set").IFromRestriction} pFromRestriction
 * @param {string} pActualPath
 * @returns {string[]|null}
 */
function extractGroups(pFromRestriction, pActualPath) {
  let lReturnValue = [];

  if (Boolean(pFromRestriction.path)) {
    let lMatchResult = pActualPath.match(pFromRestriction.path);

    if (Boolean(lMatchResult) && lMatchResult.length > 1) {
      lReturnValue = lMatchResult.filter(
        (pResult) => typeof pResult === "string"
      );
    }
  }
  return lReturnValue;
}

/**
 *
 * Examples:
 * replaceGroupPlaceholders("./src/components/$1", ["wholematch", "lala-component"]) =>
 *   './src/components/lala-component'
 *
 * replaceGroupPlaceholders("./test/components/$1/$2.spec.js$", ["wholematch", "lala-component", "things"]) =>
 *   './test/components/lala-component/things.spec.js$'
 *
 * @param {string} pString
 * @param {string[]} pExtractedGroups - note that when using the result of a
 * regex match, the 0th index contains the whole matched string and indices
 * > 1 contain matched groups
 * @returns {string} pString with the matching groups replaced with the
 * groups from pExtractedgroups
 */
function replaceGroupPlaceholders(pString, pExtractedGroups) {
  return pExtractedGroups.reduce(
    (pAll, pThis, pIndex) =>
      // eslint-disable-next-line security/detect-non-literal-regexp
      pAll.replace(new RegExp(`\\$${pIndex}`, "g"), pThis),
    pString
  );
}

module.exports = {
  extractGroups,
  replaceGroupPlaceholders,
};
