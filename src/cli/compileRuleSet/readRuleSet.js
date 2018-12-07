const fs                = require('fs');
const path              = require('path');
const stripJSONComments = require('strip-json-comments');
// const makeAbsolute      = require('../utl/makeAbsolute');

module.exports = function readRuleSet(pRulesFile) {

    if (['.js', ''].indexOf(path.extname(pRulesFile)) > -1) {
        /* eslint global-require:0, security/detect-non-literal-require:0, import/no-dynamic-require:0 */
        return require(pRulesFile);
    }

    /* TODO: something with require.resolve */
    return JSON.parse(
        stripJSONComments(
            fs.readFileSync(pRulesFile, 'utf8')
        )
    );
};
