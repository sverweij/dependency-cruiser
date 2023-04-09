import cloneDeep from "lodash/cloneDeep.js";
import get from "lodash/get.js";
import has from "lodash/has.js";
import DEFAULT_THEME from "./default-theme.mjs";

function matchesRE(pValue, pRE) {
  const lMatchResult = pValue.match && pValue.match(pRE);

  return Boolean(lMatchResult) && lMatchResult.length > 0;
}

function moduleOrDependencyMatchesCriteria(pSchemeEntry, pModule) {
  return Object.keys(pSchemeEntry.criteria).every(
    (pKey) =>
      (get(pModule, pKey) || has(pModule, pKey)) &&
      (get(pModule, pKey) === get(pSchemeEntry.criteria, pKey) ||
        matchesRE(get(pModule, pKey), get(pSchemeEntry.criteria, pKey)))
  );
}

function determineAttributes(pModuleOrDependency, pAttributeCriteria) {
  return (pAttributeCriteria || [])
    .filter((pSchemeEntry) =>
      moduleOrDependencyMatchesCriteria(pSchemeEntry, pModuleOrDependency)
    )
    .map((pSchemeEntry) => pSchemeEntry.attributes)
    .reduce((pAll, pCurrent) => ({ ...pCurrent, ...pAll }), {});
}

function normalizeTheme(pTheme) {
  let lReturnValue = cloneDeep(DEFAULT_THEME);

  if (pTheme) {
    if (pTheme.replace) {
      lReturnValue = pTheme;
    } else {
      lReturnValue.graph = { ...DEFAULT_THEME.graph, ...pTheme.graph };
      lReturnValue.node = { ...DEFAULT_THEME.node, ...pTheme.node };
      lReturnValue.edge = { ...DEFAULT_THEME.edge, ...pTheme.edge };
      lReturnValue.modules = (pTheme.modules || []).concat(
        DEFAULT_THEME.modules
      );
      lReturnValue.dependencies = (pTheme.dependencies || []).concat(
        DEFAULT_THEME.dependencies
      );
    }
  }
  return lReturnValue;
}

export default {
  normalizeTheme,
  determineAttributes,
};
