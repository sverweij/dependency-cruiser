const _get = require("lodash/get");
const DEFAULT_THEME = require("./defaultTheme.json");

function matchesRE(pValue, pRE) {
  const lMatchResult = pValue.match && pValue.match(pRE);

  return Boolean(lMatchResult) && lMatchResult.length > 0;
}

function moduleMatchesCriteria(pSchemeEntry, pModule) {
  return Object.keys(pSchemeEntry.criteria).every(
    pKey =>
      (_get(pModule, pKey) || pModule.hasOwnProperty(pKey)) &&
      (_get(pModule, pKey) === _get(pSchemeEntry.criteria, pKey) ||
        matchesRE(_get(pModule, pKey), _get(pSchemeEntry.criteria, pKey)))
  );
}

function determineAttributes(pModuleOrDependency, pAttributeCriteria) {
  return (pAttributeCriteria || [])
    .filter(pSchemeEntry =>
      moduleMatchesCriteria(pSchemeEntry, pModuleOrDependency)
    )
    .map(pSchemeEntry => pSchemeEntry.attributes)
    .reduce((pAll, pCurrent) => ({ ...pCurrent, ...pAll }), {});
}

function normalizeTheme(pTheme) {
  let lRetval = DEFAULT_THEME;

  if (pTheme) {
    if (pTheme.replace) {
      lRetval = pTheme;
    } else {
      lRetval.graph = { ...DEFAULT_THEME.graph, ...pTheme.graph };
      lRetval.node = { ...DEFAULT_THEME.node, ...pTheme.node };
      lRetval.edge = { ...DEFAULT_THEME.edge, ...pTheme.edge };
      lRetval.modules = (pTheme.modules || []).concat(DEFAULT_THEME.modules);
      lRetval.dependencies = (pTheme.dependencies || []).concat(
        DEFAULT_THEME.dependencies
      );
    }
  }
  return lRetval;
}

module.exports = {
  normalizeTheme,
  determineAttributes
};
