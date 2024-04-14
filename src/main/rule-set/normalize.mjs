import { normalizeREProperties, normalizeToREAsString } from "../helpers.mjs";

const VALID_SEVERITIES = /^(?:error|warn|info|ignore)$/;
const DEFAULT_SEVERITY = "warn";
const DEFAULT_RULE = "unnamed";
const DEFAULT_SCOPE = "module";

function normalizeSeverity(pSeverity) {
  const lSeverity = pSeverity ? pSeverity : DEFAULT_SEVERITY;

  return VALID_SEVERITIES.test(lSeverity) ? lSeverity : DEFAULT_SEVERITY;
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
  if (lReturnValue?.path) {
    lReturnValue.path = normalizeToREAsString(lReturnValue.path);
  }
  return lReturnValue;
}

// eslint-disable-next-line complexity
function normalizeVias(pRuleTo) {
  const lRuleTo = structuredClone(pRuleTo);

  if (lRuleTo?.via) {
    lRuleTo.via = normalizeVia(lRuleTo.via);
  }
  if (lRuleTo?.viaOnly) {
    lRuleTo.viaOnly = normalizeVia(lRuleTo.viaOnly);
  }
  if (lRuleTo?.viaNot) {
    if (!lRuleTo?.viaOnly?.pathNot) {
      lRuleTo.viaOnly = {
        ...lRuleTo.viaOnly,
        pathNot: normalizeToREAsString(lRuleTo.viaNot),
      };
    }
    delete lRuleTo.viaNot;
  }
  if (lRuleTo?.viaSomeNot) {
    if (!lRuleTo?.via?.pathNot) {
      lRuleTo.via = {
        ...lRuleTo.via,
        pathNot: normalizeToREAsString(lRuleTo.viaSomeNot),
      };
    }
    delete lRuleTo.viaSomeNot;
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

  if (lRuleSet?.allowed) {
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

  if (lRuleSet?.forbidden) {
    lRuleSet.forbidden = lRuleSet.forbidden
      .map(normalizeRule)
      .filter((pRule) => pRule.severity !== "ignore");
  }

  if (lRuleSet?.required) {
    lRuleSet.required = lRuleSet.required
      .map(normalizeRule)
      .filter((pRule) => pRule.severity !== "ignore");
  }

  return lRuleSet;
}
