const fs                = require('fs');
const path              = require('path');
const _get              = require('lodash/get');
const _uniqWith         = require('lodash/uniqBy');
const _isEqual          = require('lodash/isEqual');
const stripJSONComments = require('strip-json-comments');
const makeAbsolute      = require('./utl/makeAbsolute');


// TODO:
// - [ ] bork on circulars
// - [ ] process arrays

function readRuleSet(pRulesFile) {
    if (['.js', ''].indexOf(path.extname(pRulesFile)) > -1) {
        /* eslint global-require:0, security/detect-non-literal-require:0, import/no-dynamic-require:0 */
        return require(makeAbsolute(pRulesFile));
    }
    return JSON.parse(
        stripJSONComments(
            fs.readFileSync(pRulesFile, 'utf8')
        )
    );
}

function slapForbiddenTogether(pForbiddenArrayExtended, pForbiddenArrayBase){
    // TODO: override same-name rules
    return _uniqWith(
        pForbiddenArrayBase.concat(pForbiddenArrayExtended),
        _isEqual
    );
}

function slapAllowedTogether(pAllowedArrayExtended, pAllowedArrayBase){
    return _uniqWith(
        pAllowedArrayBase.concat(pAllowedArrayExtended),
        _isEqual
    );
}

function slapOptionsTogether(pOptionsExtended, pOptionsBase) {
    // TODO: make implementation less naive
    return Object.assign({}, pOptionsBase, pOptionsExtended);
}

/**
 * returns the severity for the allowed rule - and "warn" if neither
 * passed dependency-cruiser configs contain it.
 *
 * @param {*} pRuleSetExtended - a dependency-cruiser-config that extends ...
 * @param {*} pRuleSetBase - a base dependency-cruiser-config
 *
 * @returns {string} - a string from the SeverityType value set
 */
function slapAllowedSeveritiesTogether(pRuleSetExtended, pRuleSetBase){
    return _get(
        pRuleSetExtended,
        'allowedSeverity',
        _get(
            pRuleSetBase,
            'allowedSeverity',
            "warn"
        )
    );
}

function slapTogether(pRuleSetExtended, pRuleSetBase){
    // extends
    // forbidden
    // - treat as a set with as key:
    //   - if there's a name: that name - pRuleSetExtended wins
    //   - else deepCompare
    // allowed
    // - deepCompare each to prevent duplicates
    //
    // allowedSeverity
    // - pRuleSetExtended wins
    // options
    //

    return {
        forbidden: slapForbiddenTogether(
            _get(pRuleSetExtended, 'forbidden', []),
            _get(pRuleSetBase, 'forbidden', [])
        ),
        allowed: slapAllowedTogether(
            _get(pRuleSetExtended, 'allowed', []),
            _get(pRuleSetBase, 'allowed', [])
        ),
        allowedSeverity: slapAllowedSeveritiesTogether(
            pRuleSetExtended,
            pRuleSetBase
        ),
        options: slapOptionsTogether(
            _get(pRuleSetExtended, 'options', {}),
            _get(pRuleSetBase, 'options', {})
        )
    };
}

function processExtends(pRuleSet){
    let lRetval = pRuleSet;

    if (typeof pRuleSet.extends === "string") {
        lRetval = slapTogether(pRuleSet, readRuleSet(pRuleSet.extends));
    }

    if (Array.isArray(pRuleSet.extends)) {
        // TODO: run through the entire array - or ditch this to become a future feature
        lRetval = slapTogether(pRuleSet, readRuleSet(pRuleSet.extends[0]));
    }

    return lRetval;
}
function extractRuleSet(pRulesFile){
    const lRetval = readRuleSet(pRulesFile);

    if (lRetval.hasOwnProperty("extends")){
        return processExtends(lRetval);
    }
    return lRetval;
}

module.exports = extractRuleSet;
