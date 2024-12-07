import DEFAULT_THEME from "./default-theme.mjs";
import { attributizeObject } from "./module-utl.mjs";
import { has, get } from "#utl/object-util.mjs";

function matchesRE(pValue, pRE) {
  const lMatchResult = pValue.match && pValue.match(pRE);

  return lMatchResult && lMatchResult.length > 0;
}

function matchesCriterion(pModuleKey, pCriterion) {
  return pModuleKey === pCriterion || matchesRE(pModuleKey, pCriterion);
}

function moduleOrDependencyMatchesCriteria(pSchemeEntry, pModule) {
  return Object.keys(pSchemeEntry.criteria).every((pKey) => {
    // the keys can have paths in them like {"rules[0].severity": "info"}
    // To get the criterion treat that key as a string and not as a path
    // eslint-disable-next-line security/detect-object-injection
    const lCriterion = pSchemeEntry.criteria[pKey];
    // we use a bespoke 'get' here because in the criteria you can enter
    // nested keys like "rules[0].severity" : "error", and that function
    // handles those for us
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

export function getThemeAttributes(pModuleOrDependency, pAttributeCriteria) {
  return (pAttributeCriteria || [])
    .filter((pSchemeEntry) =>
      moduleOrDependencyMatchesCriteria(pSchemeEntry, pModuleOrDependency),
    )
    .map((pSchemeEntry) => pSchemeEntry.attributes)
    .reduce((pAll, pCurrent) => ({ ...pCurrent, ...pAll }), {});
}

export function normalizeTheme(pTheme) {
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

export function applyTheme(pTheme) {
  return (pModule) => ({
    ...pModule,
    dependencies: pModule.dependencies
      .map((pDependency) => ({
        ...pDependency,
        themeAttrs: attributizeObject(
          getThemeAttributes(pDependency, pTheme.dependencies),
        ),
      }))
      .map((pDependency) => ({
        ...pDependency,
        hasExtraAttributes: Boolean(pDependency.rule || pDependency.themeAttrs),
      })),
    themeAttrs: attributizeObject(getThemeAttributes(pModule, pTheme.modules)),
  });
}
