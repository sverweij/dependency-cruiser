import { getCachedRegExp } from "#utl/regex-util.mjs";

export function filenameMatchesPattern(pFullPathToFile, pPattern) {
  return getCachedRegExp(pPattern).test(pFullPathToFile);
}

export function moduleMatchesFilter(pModule, pFilter) {
  return filenameMatchesPattern(pModule.source, pFilter.path);
}

export function dependencyMatchesFilter(pDependency, pFilter) {
  return filenameMatchesPattern(pDependency.resolved, pFilter.path);
}
