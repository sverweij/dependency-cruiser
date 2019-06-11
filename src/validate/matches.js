const intersects = require('../utl/arrayUtil').intersects;

function _fromPath(pRule, pModule) {
    return (!pRule.from.path || pModule.source.match(pRule.from.path));
}

function fromPathNot (pRule, pModule){
    return (!pRule.from.pathNot || !(pModule.source.match(pRule.from.pathNot)));
}

function _replaceGroupPlaceholders(pString, pExtractedGroups) {
    return pExtractedGroups.reduce(
        (pAll, pThis, pIndex) => pAll.replace(`$${pIndex}`, pThis),
        pString
    );
}

function _toPath(pRule, pString, pGroups = []) {
    return (!pRule.to.path ||
        (pGroups.length > 0
            ? pString.match(_replaceGroupPlaceholders(pRule.to.path, pGroups))
            : pString.match(pRule.to.path)
        )
    );
}

function toDependencyPath(pRule, pDependency, pGroups) {
    return _toPath(pRule, pDependency.resolved, pGroups);
}

function toModulePath(pRule, pModule, pGroups) {
    return _toPath(pRule, pModule.source, pGroups);
}

function _toPathNot(pRule, pString, pGroups = []) {
    return  (!Boolean(pRule.to.pathNot) ||
                !(pGroups.length > 0
                    ? pString.match(_replaceGroupPlaceholders(pRule.to.pathNot, pGroups))
                    : pString.match(pRule.to.pathNot)
                )
    );
}

function toDependencyPathNot(pRule, pDependency, pGroups) {
    return _toPathNot(pRule, pDependency.resolved, pGroups);
}

function toModulePathNot(pRule, pModule, pGroups) {
    return _toPathNot(pRule, pModule.source, pGroups);
}

function toDependencyTypes(pRule, pDependency) {
    return (!pRule.to.dependencyTypes ||
        intersects(pDependency.dependencyTypes, pRule.to.dependencyTypes)
    );
}

function toLicense(pRule, pDependency) {
    return (!pRule.to.license ||
        pDependency.license && pDependency.license.match(pRule.to.license)
    );
}

function toLicenseNot(pRule, pDependency) {
    return (!pRule.to.licenseNot ||
        pDependency.license && !pDependency.license.match(pRule.to.licenseNot)
    );
}

module.exports = {
    fromPath: _fromPath,
    fromPathNot,
    toDependencyPath,
    toModulePath,
    toDependencyPathNot,
    toModulePathNot,
    toDependencyTypes,
    toLicense,
    toLicenseNot
};
