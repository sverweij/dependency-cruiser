import normalizeRuleSet from "../../src/main/rule-set/normalize.mjs";
import validateRuleSet from "../../src/main/rule-set/validate.mjs";

export default (pRuleSet) => normalizeRuleSet(validateRuleSet(pRuleSet));
