/* if there is at least one group expression in the given pRulePath
   return the first matched one.
   return null in all other cases

   This fills our current need. Later we can expand it to return all group
   matches.
*/
function extractGroups(pRule, pActualPath) {
  let lReturnValue = [];

  if (Boolean(pRule.path)) {
    let lMatchResult = pActualPath.match(pRule.path);

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
