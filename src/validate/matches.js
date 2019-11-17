const intersects = require("../utl/arrayUtil").intersects;

function fromPath(pRule, pModule) {
  return !pRule.from.path || pModule.source.match(pRule.from.path);
}

function fromPathNot(pRule, pModule) {
  return !pRule.from.pathNot || !pModule.source.match(pRule.from.pathNot);
}

function _replaceGroupPlaceholders(pString, pExtractedGroups) {
  return pExtractedGroups.reduce(
    (pAll, pThis, pIndex) =>
      // eslint-disable-next-line security/detect-non-literal-regexp
      pAll.replace(new RegExp(`\\$${pIndex}`, "g"), pThis),
    pString
  );
}

function _toPath(pRule, pString, pGroups = []) {
  return (
    !pRule.to.path ||
    (pGroups.length > 0
      ? pString.match(_replaceGroupPlaceholders(pRule.to.path, pGroups))
      : pString.match(pRule.to.path))
  );
}

function toDependencyPath(pRule, pDependency, pGroups) {
  return _toPath(pRule, pDependency.resolved, pGroups);
}

function toModulePath(pRule, pModule, pGroups) {
  return _toPath(pRule, pModule.source, pGroups);
}

function _toPathNot(pRule, pString, pGroups = []) {
  return (
    !Boolean(pRule.to.pathNot) ||
    !(pGroups.length > 0
      ? pString.match(_replaceGroupPlaceholders(pRule.to.pathNot, pGroups))
      : pString.match(pRule.to.pathNot))
  );
}

function toDependencyPathNot(pRule, pDependency, pGroups) {
  return _toPathNot(pRule, pDependency.resolved, pGroups);
}

function toModulePathNot(pRule, pModule, pGroups) {
  return _toPathNot(pRule, pModule.source, pGroups);
}

function toDependencyTypes(pRule, pDependency) {
  return (
    !pRule.to.dependencyTypes ||
    intersects(pDependency.dependencyTypes, pRule.to.dependencyTypes)
  );
}

function toLicense(pRule, pDependency) {
  return (
    !pRule.to.license ||
    (pDependency.license && pDependency.license.match(pRule.to.license))
  );
}

function toLicenseNot(pRule, pDependency) {
  return (
    !pRule.to.licenseNot ||
    (pDependency.license && !pDependency.license.match(pRule.to.licenseNot))
  );
}

function toExoticRequire(pRule, pDependency) {
  return (
    !pRule.to.exoticRequire ||
    (pDependency.exoticRequire &&
      pDependency.exoticRequire.match(pRule.to.exoticRequire))
  );
}

function toExoticRequireNot(pRule, pDependency) {
  return (
    !pRule.to.exoticRequireNot ||
    (pDependency.exoticRequire &&
      !pDependency.exoticRequire.match(pRule.to.exoticRequireNot))
  );
}

module.exports = {
  _replaceGroupPlaceholders,
  fromPath,
  fromPathNot,
  toDependencyPath,
  toModulePath,
  toDependencyPathNot,
  toModulePathNot,
  toDependencyTypes,
  toLicense,
  toLicenseNot,
  toExoticRequire,
  toExoticRequireNot
};
