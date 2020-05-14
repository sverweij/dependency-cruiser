module.exports = function filenameMatchesPattern(pFullPathToFile, pPattern) {
  return RegExp(pPattern, "g").test(pFullPathToFile);
};
