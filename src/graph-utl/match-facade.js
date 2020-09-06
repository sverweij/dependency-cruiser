function filenameMatchesPattern(pFullPathToFile, pPattern) {
  return RegExp(pPattern, "g").test(pFullPathToFile);
}

function moduleMatchesFilter(pModule, pFilter) {
  return filenameMatchesPattern(pModule.source, pFilter.path);
}

function dependencyMatchesFilter(pDependency, pFilter) {
  return filenameMatchesPattern(pDependency.resolved, pFilter.path);
}

module.exports = {
  moduleMatchesFilter,
  dependencyMatchesFilter,
  filenameMatchesPattern,
};
