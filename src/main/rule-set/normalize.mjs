import has from "lodash/has.js";
import { normalizeREProperties, normalizeToREAsString } from "../helpers.mjs";

const VALID_SEVERITIES = /^(error|warn|info|ignore)$/;
const DEFAULT_SEVERITY = "warn";
const DEFAULT_RULE = "unnamed";
const DEFAULT_SCOPE = "module";

function normalizeSeverity(pSeverity) {
  const lSeverity = pSeverity ? pSeverity : DEFAULT_SEVERITY;

  return Boolean(lSeverity.match(VALID_SEVERITIES))
    ? lSeverity
    : DEFAULT_SEVERITY;
}
/**
 *
 * @param {string} pRuleName
 * @returns {string}
 */
function normalizeName(pRuleName) {
  return pRuleName ? pRuleName : DEFAULT_RULE;
}

/**
 * @param {import("../../../types/shared-types.mjs").RuleScopeType} pScope?
 * @returns {import("../../../types/shared-types.mjs").RuleScopeType}
 */
function normalizeScope(pScope) {
  return pScope ? pScope : DEFAULT_SCOPE;
}

/**
 * @param {import("../../../types/restrictions.mjs").MiniDependencyRestrictionType} pVia
 * @returns {import("../../../types/strict-restrictions.mjs").IStrictMiniDependencyRestriction}
 */
function normalizeVia(pVia) {
  let lReturnValue = {};

  if (typeof pVia === "string" || Array.isArray(pVia)) {
    lReturnValue.path = pVia;
  } else {
    lReturnValue = structuredClone(pVia);
  }
  if (has(lReturnValue, "path")) {
    lReturnValue.path = normalizeToREAsString(lReturnValue.path);
  }
  return lReturnValue;
}

function normalizeVias(pRuleTo) {
  const lRuleTo = structuredClone(pRuleTo);

  if (has(lRuleTo, "via")) {
    lRuleTo.via = normalizeVia(lRuleTo.via);
  }
  if (has(lRuleTo, "viaNot")) {
    lRuleTo.viaNot = normalizeVia(lRuleTo.viaNot);
  }
  if (has(lRuleTo, "viaOnly")) {
    lRuleTo.viaOnly = normalizeVia(lRuleTo.viaOnly);
  }
  if (has(lRuleTo, "viaSomeNot")) {
    lRuleTo.viaSomeNot = normalizeVia(lRuleTo.viaSomeNot);
  }
  return lRuleTo;
}

/**
 * @param {import("../../../types/rule-set.mjs").IAnyRuleType} pRule
 * @returns {import("../../../types/strict-rule-set.mjs").IStrictAnyRuleType}
 */
function normalizeRule(pRule) {
  const lRuleTo = normalizeVias(pRule.to);
  return {
    ...pRule,
    severity: normalizeSeverity(pRule.severity),
    name: normalizeName(pRule.name),
    from: normalizeREProperties(pRule.from),
    to: normalizeREProperties(lRuleTo),
    scope: normalizeScope(pRule.scope),
    ...(pRule.module ? { module: normalizeREProperties(pRule.module) } : {}),
  };
}

/**
 * 'Normalizes' the given rule set pRuleSet by adding default values for
 * attributes that are optional and not present in the rule set; in casu:
 * - rule name (default 'unnamed')
 * - severity (default 'warn')
 *
 * @param  {import("../../../types/dependency-cruiser.js").IFlattenedRuleSet} pRuleSet
 * @return {import("../../../types/strict-rule-set.js").IStrictRuleSet}
 */
export default function normalizeRuleSet(pRuleSet) {
  const lRuleSet = structuredClone(pRuleSet);

  if (has(lRuleSet, "allowed")) {
    lRuleSet.allowedSeverity = normalizeSeverity(lRuleSet.allowedSeverity);
    if (lRuleSet.allowedSeverity === "ignore") {
      Reflect.deleteProperty(lRuleSet, "allowed");
      Reflect.deleteProperty(lRuleSet, "allowedSeverity");
    } else {
      lRuleSet.allowed = lRuleSet.allowed.map((pRule) => {
        const lRuleTo = normalizeVias(pRule.to);
        return {
          ...pRule,
          name: "not-in-allowed",
          from: normalizeREProperties(pRule.from),
          to: normalizeREProperties(lRuleTo),
        };
      });
    }
  }

  if (has(lRuleSet, "forbidden")) {
    lRuleSet.forbidden = lRuleSet.forbidden
      .map(normalizeRule)
      .filter((pRule) => pRule.severity !== "ignore");
  }

  if (has(lRuleSet, "required")) {
    lRuleSet.required = lRuleSet.required
      .map(normalizeRule)
      .filter((pRule) => pRule.severity !== "ignore");
  }

  return lRuleSet;
}
