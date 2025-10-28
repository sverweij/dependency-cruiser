import { testCachedRegex } from "#utl/regex-cache.mjs";

export function filenameMatchesPattern(pFullPathToFile, pPattern) {
  return testCachedRegex(pFullPathToFile, pPattern);
}

export function moduleMatchesFilter(pModule, pFilter) {
  return filenameMatchesPattern(pModule.source, pFilter.path);
}

export function dependencyMatchesFilter(pDependency, pFilter) {
  return filenameMatchesPattern(pDependency.resolved, pFilter.path);
}
