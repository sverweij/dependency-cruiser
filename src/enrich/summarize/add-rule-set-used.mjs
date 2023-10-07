// the fixed name for allowed rules served a purpose during the extraction
// process - but it's not necessary to reflect it in the output.
function removeNames(pRule) {
  const lReturnValue = structuredClone(pRule);

  Reflect.deleteProperty(lReturnValue, "name");
  return lReturnValue;
}

export default function addRuleSetUsed(pOptions) {
  const lForbidden = pOptions?.ruleSet?.forbidden;
  const lAllowed = pOptions?.ruleSet?.allowed;
  const lAllowedSeverity = pOptions?.ruleSet?.allowedSeverity;
  const lRequired = pOptions?.ruleSet?.required;

  return Object.assign(
    lForbidden ? { forbidden: lForbidden } : {},
    lAllowed ? { allowed: lAllowed.map(removeNames) } : {},
    lAllowedSeverity ? { allowedSeverity: lAllowedSeverity } : {},
    lRequired ? { required: lRequired } : {},
  );
}
