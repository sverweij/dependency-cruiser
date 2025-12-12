export function filenameMatchesPattern(pFullPathToFile, pPattern) {
  // eslint-disable-next-line security/detect-non-literal-regexp
  return new RegExp(pPattern, "g").test(pFullPathToFile);
}

export function moduleMatchesFilter(pModule, pFilter) {
  return filenameMatchesPattern(pModule.source, pFilter.path);
}

export function dependencyMatchesFilter(pDependency, pFilter) {
  return filenameMatchesPattern(pDependency.resolved, pFilter.path);
}
