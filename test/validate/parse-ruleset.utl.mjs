import normalizeRuleSet from "../../src/main/rule-set/normalize.js";
import validateRuleSet from "../../src/main/rule-set/validate.js";

export default (pRuleSet) => normalizeRuleSet(validateRuleSet(pRuleSet));
