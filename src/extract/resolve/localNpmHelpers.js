const fs       = require('fs');
const path     = require('path');
const _memoize = require('lodash/memoize');
const resolve  = require('./resolve');

const isLocal     = (pModule) => pModule.startsWith('.');
const isScoped    = (pModule) => pModule.startsWith('@');

/**
 * Returns the 'root' of the package - the spot where we can probably find
 * the package.json of that package, and the reference we'd usualy have
 * in our own package.json to declare the dependency.
 *
 * Some samples:
 * - for unscoped packages this would be everything up to the first '/':
 *    - 'lodash/fp' => 'lodash'
 *    - 'mypackage/some/module' => 'mypackage'
 * - for scoped packages this would be everything up to the second '/',
 *   if it's there (which should normaly be the case, but nevertheless we
 *   can't assume that)
 *   - @angular/common => @angular/common
 *   - @somescope/some/module => @somescope/some
 *   - @imdoingweirdvoodoo => @imdoingweirdvoodoo
 * - for local packages it doesn't make sense to call this function, but
 *   if consumers insist it'll return the local package name unchanged:
 *   - './myThing' => './myThing'
 *   - './some/other/thing' => './some/other/thing'
 *
 * At this time we don't take situations into account where the caller includes
 * a node module through a local path (which could make sense if you're on
 * non-commonJS and are still using node_modules) e.g. '../node_modules/lodash/fp'
 *
 * @param  {string} pModule a module name
 * @return {string}         the module name root
 */
function getPackageRoot (pModule) {
    if (!Boolean(pModule) || isLocal(pModule)) {
        return pModule;
    }

    let lPathElements = pModule.split("/");

    if (isScoped(pModule)) {
        // '@imdoingweirdvoodoo'
        if (lPathElements.length === 1) {
            return pModule;
        }

        // @scope/package
        // @scope/package/some/thing
        return `${lPathElements[0]}/${lPathElements[1]}`;
    }

    // lodash
    // lodash/fp
    return lPathElements[0];
}

/**
 * returns the contents of the package.json of the given pModule as it would
 * resolve from pBaseDir
 *
 * e.g. to get the package.json of `lodash` that is required bya
 * `src/report/something.js` use `getPackageJSON('lodash', 'src/report/');`
 *
 * The pBaseDir parameter is necessary because dependency-cruiser/ this module
 * will have a different base dir, and will hence resolve either to the
 * wrong package or not to a package at all.
 *
 * @param  {string} pModule  The module to get the package.json of
 * @param  {string} pBaseDir The base dir. Defaults to '.'
 * @param  {any} pResolveOptions options for the resolver
 * @return {object}          The package.json as a javascript object, or
 *                           null if either module or package.json could
 *                           not be found
 */
function bareGetPackageJson (pModule, pBaseDir, pResolveOptions){
    let lRetval = null;

    try {
        let lPackageJsonFilename = resolve(
            path.join(getPackageRoot(pModule), "package.json"),
            pBaseDir ? pBaseDir : ".",
            pResolveOptions
        );

        lRetval = JSON.parse(
            fs.readFileSync(lPackageJsonFilename, 'utf8')
        );

    } catch (e) {
        // left empty on purpose
    }
    return lRetval;
}

const getPackageJson =
    _memoize(
        bareGetPackageJson,
        (pModule, pBaseDir) => `${pBaseDir}|${pModule}`
    );

/**
 * Tells whether the pModule as resolved to pBaseDir is deprecated
 *
 * @param  {string} pModule  The module to get the deprecation status of
 * @param  {string} pBaseDir The base dir. Defaults to '.'
 * @param  {any} pResolveOptions options for the resolver
 * @return {boolean}         true if deprecated, false in all other cases
 */
function dependencyIsDeprecated (pModule, pBaseDir, pResolveOptions) {
    let lRetval = false;
    let lPackageJson = getPackageJson(pModule, pBaseDir, pResolveOptions);

    if (Boolean(lPackageJson)){
        lRetval = lPackageJson.hasOwnProperty("deprecated") && lPackageJson.deprecated;
    }
    return lRetval;
}

/**
 * Returns the license of pModule as resolved to pBaseDir - if any
 *
 * @param  {string} pModule  The module to get the deprecation status of
 * @param  {string} pBaseDir The base dir. Defaults to '.'
 * @param  {any} pResolveOptions options for the resolver
 * @return {string}          The module's license string, or '' in case
 *                           there is no package.json or no license field
 */
function getLicense (pModule, pBaseDir, pResolveOptions) {
    let lRetval = "";
    let lPackageJson = getPackageJson(pModule, pBaseDir, pResolveOptions);

    if (
        Boolean(lPackageJson) &&
        lPackageJson.hasOwnProperty("license") &&
        typeof lPackageJson.license === "string"
    ){
        lRetval = lPackageJson.license;
    }
    return lRetval;
}

module.exports = {
    getPackageRoot,
    getPackageJson,
    dependencyIsDeprecated,
    getLicense
};
