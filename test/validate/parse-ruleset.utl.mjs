import normalizeRuleSet from "../../src/main/rule-set/normalize.mjs";
import assertRuleSetValid from "../../src/main/rule-set/assert-validity.mjs";

export default (pRuleSet) => normalizeRuleSet(assertRuleSetValid(pRuleSet));
