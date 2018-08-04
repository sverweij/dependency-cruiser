const fs = require('fs');
const path = require('path');
const _merge = require('lodash').merge;
const stripJSONComments = require('strip-json-comments');

function flattenTypeScriptConfig(pTSConfigFileName, pReadConfigSet = new Set()) {
    pTSConfigFileName = path.resolve(pTSConfigFileName);
    if (pReadConfigSet.has(pTSConfigFileName)) {
        throw new Error('The provided typescript config setup has a circular reference.');
    } else {
        pReadConfigSet.add(pTSConfigFileName);
        let lConfig = JSON.parse(stripJSONComments(fs.readFileSync(pTSConfigFileName, 'utf8')));

        if (lConfig.extends) {
            lConfig = _merge(
                flattenTypeScriptConfig(
                    path.join(path.dirname(pTSConfigFileName), lConfig.extends),
                    pReadConfigSet
                ),
                lConfig
            );
            Reflect.deleteProperty(lConfig, "extends");
        }

        return lConfig;
    }

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
 */
module.exports = flattenTypeScriptConfig;
