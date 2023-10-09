import normalizeRuleSet from "#main/rule-set/normalize.mjs";
import assertRuleSetValid from "#main/rule-set/assert-validity.mjs";

export default (pRuleSet) => normalizeRuleSet(assertRuleSetValid(pRuleSet));
