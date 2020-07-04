const _get = require("lodash/get");
const _clone = require("lodash/clone");

// the fixed name for allowed rules served a purpose during the extraction
// process - but it's not necessary to reflect it in the output.
function removeNames(pRule) {
  const lReturnValue = _clone(pRule);

  Reflect.deleteProperty(lReturnValue, "name");
  return lReturnValue;
}

module.exports = function addRuleSetUsed(pOptions) {
  const lForbidden = _get(pOptions, "ruleSet.forbidden");
  const lAllowed = _get(pOptions, "ruleSet.allowed");
  const lAllowedSeverity = _get(pOptions, "ruleSet.allowedSeverity");
  const lRequired = _get(pOptions, "ruleSet.required");

  return Object.assign(
    lForbidden ? { forbidden: lForbidden } : {},
    lAllowed ? { allowed: lAllowed.map(removeNames) } : {},
    lAllowedSeverity ? { allowedSeverity: lAllowedSeverity } : {},
    lRequired ? { required: lRequired } : {}
  );
};
