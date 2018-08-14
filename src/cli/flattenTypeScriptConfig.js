const fs = require('fs');
const path = require('path');
const _mergeWith = require('lodash/mergeWith');
const _isArray = require('lodash/isArray');
const stripJSONComments = require('strip-json-comments');

function butConcatArrays(pObjectValue, pSrcValue, pKey) {
    if (['files', 'include', 'exclude'].includes(pKey)){
        return pSrcValue;
    }
    if (_isArray(pObjectValue)) {
        return pSrcValue.concat(pObjectValue);
    }
    // leave all other types of object alone, so mergeWith does the
    // default thing on it - which is fine. returning
    // undefined (~= not returning anything) is the
    // way lodash documentation describes to do that, hence the
    // conscious ignore of the consistent-return rule here
    /* eslint consistent-return: 0 */
}

/**
 * Reads the provided tsconfig, strips any comments and merges it with any
 * file mentioned in the "extends" section of the config
 *
 * @param {string} pTSConfigFileName The file name of the tsconfig.json to flatten
 * @param {Set} pReadConfigSet       (optional) set of config file names already
 *                                   read; internally used for circular
 *                                   reference detection. Typically you don't
 *                                   need to specify this when calling
 * @return {any}                     Object with the config in the pTSConfigFileName,
 *                                   with all extends 'flattened'
 */
function flattenTypeScriptConfig(pTSConfigFileName, pReadConfigSet = new Set()) {
    pTSConfigFileName = path.resolve(pTSConfigFileName);
    if (pReadConfigSet.has(pTSConfigFileName)) {
        throw new Error('The provided typescript config setup has a circular reference.');
    } else {
        pReadConfigSet.add(pTSConfigFileName);
        let lConfig = JSON.parse(stripJSONComments(fs.readFileSync(pTSConfigFileName, 'utf8')));

        if (lConfig.extends) {
            lConfig = _mergeWith(
                flattenTypeScriptConfig(
                    path.join(path.dirname(pTSConfigFileName), lConfig.extends),
                    pReadConfigSet
                ),
                lConfig,
                // Arrays from parents shouldn't get half-overwritten, but
                // actually slapped on the back of what's already there.
                // We override the default _.merge behavior for `files`,
                // `include` and `exclude`. for those the child always
                // overwrites the parent, according to the
                // [typescript handbook](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
                butConcatArrays
            );
            Reflect.deleteProperty(lConfig, "extends");
        }

        return lConfig;
    }
}

module.exports = flattenTypeScriptConfig;
