/* eslint-disable security/detect-object-injection */
const _has = require("lodash/has");
const { intersects } = require("../utl/array-util");
const { replaceGroupPlaceholders } = require("../utl/regex-util");

function propertyEquals(pRule, pDependency, pProperty) {
  // The properties can be booleans, so we can't use !pRule.to[pProperty]
  if (_has(pRule.to, pProperty)) {
    return pDependency[pProperty] === pRule.to[pProperty];
  }
  return true;
}

function propertyMatches(pRule, pDependency, pRuleProperty, pProperty) {
  return Boolean(
    !pRule.to[pRuleProperty] ||
      (pDependency[pProperty] &&
        pDependency[pProperty].match(pRule.to[pRuleProperty]))
  );
}

function propertyMatchesNot(pRule, pDependency, pRuleProperty, pProperty) {
  return Boolean(
    !pRule.to[pRuleProperty] ||
      (pDependency[pProperty] &&
        !pDependency[pProperty].match(pRule.to[pRuleProperty]))
  );
}

function fromPath(pRule, pModule) {
  return Boolean(!pRule.from.path || pModule.source.match(pRule.from.path));
}

function fromPathNot(pRule, pModule) {
  return Boolean(
    !pRule.from.pathNot || !pModule.source.match(pRule.from.pathNot)
  );
}

function modulePath(pRule, pModule) {
  return Boolean(!pRule.module.path || pModule.source.match(pRule.module.path));
}

function modulePathNot(pRule, pModule) {
  return Boolean(
    !pRule.module.pathNot || !pModule.source.match(pRule.module.pathNot)
  );
}

function _toPath(pRule, pString, pGroups = []) {
  return Boolean(
    !pRule.to.path ||
      (pGroups.length > 0
        ? pString.match(replaceGroupPlaceholders(pRule.to.path, pGroups))
        : pString.match(pRule.to.path))
  );
}

function toPath(pRule, pDependency, pGroups) {
  return _toPath(pRule, pDependency.resolved, pGroups);
}

function toModulePath(pRule, pModule, pGroups) {
  return _toPath(pRule, pModule.source, pGroups);
}

function _toPathNot(pRule, pString, pGroups = []) {
  return (
    !Boolean(pRule.to.pathNot) ||
    !(pGroups.length > 0
      ? pString.match(replaceGroupPlaceholders(pRule.to.pathNot, pGroups))
      : pString.match(pRule.to.pathNot))
  );
}

function toPathNot(pRule, pDependency, pGroups) {
  return _toPathNot(pRule, pDependency.resolved, pGroups);
}

function toModulePathNot(pRule, pModule, pGroups) {
  return _toPathNot(pRule, pModule.source, pGroups);
}

function toDependencyTypes(pRule, pDependency) {
  return Boolean(
    !pRule.to.dependencyTypes ||
      intersects(pDependency.dependencyTypes, pRule.to.dependencyTypes)
  );
}

function toDependencyTypesNot(pRule, pDependency) {
  return Boolean(
    !pRule.to.dependencyTypesNot ||
      !intersects(pDependency.dependencyTypes, pRule.to.dependencyTypesNot)
  );
}

function toVia(pRule, pDependency) {
  return Boolean(
    !pRule.to.via ||
      (pDependency.cycle &&
        pDependency.cycle.some((pVia) => pVia.match(pRule.to.via)))
  );
}

function toViaNot(pRule, pDependency) {
  return Boolean(
    !pRule.to.viaNot ||
      (pDependency.cycle &&
        !pDependency.cycle.some((pVia) => pVia.match(pRule.to.viaNot)))
  );
}

function toIsMoreUnstable(pRule, pModule, pDependency) {
  if (_has(pRule, "to.moreUnstable")) {
    return (
      (pRule.to.moreUnstable &&
        pModule.instability < pDependency.instability) ||
      (!pRule.to.moreUnstable && pModule.instability >= pDependency.instability)
    );
  }
  return true;
}

function matchesMoreThanOneDependencyType(pRule, pDependency) {
  if (_has(pRule.to, "moreThanOneDependencyType")) {
    return (
      pRule.to.moreThanOneDependencyType ===
      pDependency.dependencyTypes.length > 1
    );
  }
  return true;
}

module.exports = {
  replaceGroupPlaceholders,
  propertyEquals,
  propertyMatches,
  propertyMatchesNot,
  fromPath,
  fromPathNot,
  toPath,
  toModulePath,
  modulePath,
  modulePathNot,
  toPathNot,
  toModulePathNot,
  toDependencyTypes,
  toDependencyTypesNot,
  toVia,
  toViaNot,
  toIsMoreUnstable,
  matchesMoreThanOneDependencyType,
};
