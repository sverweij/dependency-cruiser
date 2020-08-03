/**
 * If there is at least one group expression in the given pRulePath
 * return the first matched one.
 *
 * Return null in all other cases.
 *
 * This fills our current need. Later we can expand it to return all group
 * matches.
 *
 * @param {import("../../types/rule-set").IFromRestriction} pRestriction
 * @param {string} pActualPath
 * @returns {string[]|null}
 */
function extractGroups(pRestriction, pActualPath) {
  let lReturnValue = [];

  if (Boolean(pRestriction.path)) {
    let lMatchResult = pActualPath.match(pRestriction.path);

    if (Boolean(lMatchResult) && lMatchResult.length > 1) {
      lReturnValue = lMatchResult.filter(
        (pResult) => typeof pResult === "string"
      );
    }
  }
  return lReturnValue;
}

module.exports = {
  extractGroups,
};
