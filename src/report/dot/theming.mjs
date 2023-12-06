import get from "lodash/get.js";
import has from "lodash/has.js";
import DEFAULT_THEME from "./default-theme.mjs";

function matchesRE(pValue, pRE) {
  const lMatchResult = pValue.match && pValue.match(pRE);

  return Boolean(lMatchResult) && lMatchResult.length > 0;
}

function matchesCriterion(pModuleKey, pCriterion) {
  return pModuleKey === pCriterion || matchesRE(pModuleKey, pCriterion);
}

function moduleOrDependencyMatchesCriteria(pSchemeEntry, pModule) {
  return Object.keys(pSchemeEntry.criteria).every((pKey) => {
    // we use lodash.get here because in the criteria you can enter
    // nested keys like "rules[0].severity" : "error", and lodash.get handles
    // that for us
    const lCriterion = get(pSchemeEntry.criteria, pKey);
    const lModuleKey = get(pModule, pKey);

    if (!(lModuleKey || has(pModule, pKey))) {
      return false;
    }

    if (Array.isArray(lModuleKey)) {
      if (Array.isArray(lCriterion)) {
        return lCriterion.some((pCriterionEntry) =>
          lModuleKey.some((pModuleKeyEntry) =>
            matchesCriterion(pModuleKeyEntry, pCriterionEntry),
          ),
        );
      } else {
        return lModuleKey.some((pModuleKeyEntry) =>
          matchesCriterion(pModuleKeyEntry, lCriterion),
        );
      }
    }
    if (Array.isArray(lCriterion)) {
      return lCriterion.some((pCriterionEntry) =>
        matchesCriterion(lModuleKey, pCriterionEntry),
      );
    }
    return matchesCriterion(lModuleKey, lCriterion);
  });
}

function determineAttributes(pModuleOrDependency, pAttributeCriteria) {
  return (pAttributeCriteria || [])
    .filter((pSchemeEntry) =>
      moduleOrDependencyMatchesCriteria(pSchemeEntry, pModuleOrDependency),
    )
    .map((pSchemeEntry) => pSchemeEntry.attributes)
    .reduce((pAll, pCurrent) => ({ ...pCurrent, ...pAll }), {});
}

function normalizeTheme(pTheme) {
  let lReturnValue = structuredClone(DEFAULT_THEME);

  if (pTheme) {
    if (pTheme.replace) {
      lReturnValue = pTheme;
    } else {
      lReturnValue.graph = { ...DEFAULT_THEME.graph, ...pTheme.graph };
      lReturnValue.node = { ...DEFAULT_THEME.node, ...pTheme.node };
      lReturnValue.edge = { ...DEFAULT_THEME.edge, ...pTheme.edge };
      lReturnValue.modules = (pTheme.modules || []).concat(
        DEFAULT_THEME.modules,
      );
      lReturnValue.dependencies = (pTheme.dependencies || []).concat(
        DEFAULT_THEME.dependencies,
      );
    }
  }
  return lReturnValue;
}

export default {
  normalizeTheme,
  determineAttributes,
};
