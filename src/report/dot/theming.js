const _cloneDeep = require("lodash/cloneDeep");
const _get = require("lodash/get");
const _has = require("lodash/has");
const DEFAULT_THEME = require("./default-theme.json");

function matchesRE(pValue, pRE) {
  const lMatchResult = pValue.match && pValue.match(pRE);

  return Boolean(lMatchResult) && lMatchResult.length > 0;
}

function moduleMatchesCriteria(pSchemeEntry, pModule) {
  return Object.keys(pSchemeEntry.criteria).every(
    (pKey) =>
      (_get(pModule, pKey) || _has(pModule, pKey)) &&
      (_get(pModule, pKey) === _get(pSchemeEntry.criteria, pKey) ||
        matchesRE(_get(pModule, pKey), _get(pSchemeEntry.criteria, pKey)))
  );
}

function determineAttributes(pModuleOrDependency, pAttributeCriteria) {
  return (pAttributeCriteria || [])
    .filter((pSchemeEntry) =>
      moduleMatchesCriteria(pSchemeEntry, pModuleOrDependency)
    )
    .map((pSchemeEntry) => pSchemeEntry.attributes)
    .reduce((pAll, pCurrent) => ({ ...pCurrent, ...pAll }), {});
}

function normalizeTheme(pTheme) {
  let lReturnValue = _cloneDeep(DEFAULT_THEME);

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

module.exports = {
  normalizeTheme,
  determineAttributes,
};
