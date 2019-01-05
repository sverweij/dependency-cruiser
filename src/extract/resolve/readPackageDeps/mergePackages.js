const _uniq  = require('lodash/uniq');
const _get   = require('lodash/get');
const _clone = require('lodash/clone');

function normalizePackageKeys(pPackage) {
    let lRetval = pPackage;

    if (pPackage.bundleDependencies) {
        pPackage.bundledDependencies = _clone(pPackage.bundleDependencies);
        Reflect.deleteProperty(pPackage, "bundleDependencies");
    }
    return lRetval;
}

function mergeDependencyKey(pClosestDependencyKey, pFurtherDependencyKey) {
    return Object.assign(
        {},
        pFurtherDependencyKey,
        pClosestDependencyKey
    );
}

function mergeDependencyArray(pClosestDependencyKey, pFurtherDependencyKey) {
    return _uniq(
        pClosestDependencyKey.concat(pFurtherDependencyKey)
    );
}

function isDependencyKey(pKey) {
    return pKey.endsWith("ependencies");
}

function getDependencyKeys(pPackage) {
    return Object.keys(pPackage).filter(isDependencyKey);
}

function getJointDependencyKeys(pClosestPackage, pFurtherPackage) {
    return _uniq(
        getDependencyKeys(pClosestPackage)
            .concat(getDependencyKeys(pFurtherPackage))
    );
}

/**
 * returns an object with
 * - the *dependencies keys from both passed packages
 * - in each dependency key the merged dependencies of both packages
 *   in case of conflicts the dependency in the closest package 'wins'
 *
 * It takes into account each key ending in 'ependencies' - so dev, optional,
 * bundle, peer and regular dependencies are included.
 *
 * (This function exists for mono repos that use 'collective' dependencies)
 * @param  {any} pClosestPackage the contents of the package.json closer to the
 *                               source being perused (e.g. ./packages/sub/package.json)
 * @param  {any} pFurtherPackage the contents of a package.json further away
 *                               (e.g. ./package.json)
 * @return {any}                 the dependency-keys of
 */
module.exports = (pClosestPackage, pFurtherPackage) =>
    getJointDependencyKeys(
        normalizePackageKeys(pClosestPackage),
        normalizePackageKeys(pFurtherPackage)
    )
        .map(
            pKey => ({
                key: pKey,
                value: pKey.startsWith("bundle")
                    ? mergeDependencyArray(
                        _get(pClosestPackage, pKey, []),
                        _get(pFurtherPackage, pKey, [])
                    )
                    : mergeDependencyKey(
                        _get(pClosestPackage, pKey, {}),
                        _get(pFurtherPackage, pKey, {})
                    )
            })
        )
        .reduce(
            (pJoinedObject, pJoinedKey) => {
                pJoinedObject[pJoinedKey.key] = pJoinedKey.value;
                return pJoinedObject;
            },
            {}
        );
