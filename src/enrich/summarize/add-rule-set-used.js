const get = require("lodash/get");
const clone = require("lodash/clone");

// the fixed name for allowed rules served a purpose during the extraction
// process - but it's not necessary to reflect it in the output.
function removeNames(pRule) {
  const lReturnValue = clone(pRule);

  Reflect.deleteProperty(lReturnValue, "name");
  return lReturnValue;
}

module.exports = function addRuleSetUsed(pOptions) {
  const lForbidden = get(pOptions, "ruleSet.forbidden");
  const lAllowed = get(pOptions, "ruleSet.allowed");
  const lAllowedSeverity = get(pOptions, "ruleSet.allowedSeverity");
  const lRequired = get(pOptions, "ruleSet.required");

  return Object.assign(
    lForbidden ? { forbidden: lForbidden } : {},
    lAllowed ? { allowed: lAllowed.map(removeNames) } : {},
    lAllowedSeverity ? { allowedSeverity: lAllowedSeverity } : {},
    lRequired ? { required: lRequired } : {}
  );
};
