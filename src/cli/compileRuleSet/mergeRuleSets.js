const _get      = require('lodash/get');
const _uniqWith = require('lodash/uniqWith');
const _isEqual  = require('lodash/isEqual');

function mergeForbidden(pForbiddenArrayExtended, pForbiddenArrayBase){
    // TODO: override same-name rules
    return _uniqWith(
        pForbiddenArrayBase.concat(pForbiddenArrayExtended),
        _isEqual
    );
}

function mergeAllowed(pAllowedArrayExtended, pAllowedArrayBase){
    return _uniqWith(
        pAllowedArrayBase.concat(pAllowedArrayExtended),
        _isEqual
    );
}

function mergeOptions(pOptionsExtended, pOptionsBase) {
    // TODO: make implementation less naive (?)
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
function mergeAllowedSeverities(pRuleSetExtended, pRuleSetBase){
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

module.exports = (pRuleSetExtended, pRuleSetBase) => {
    let lRetval = {
        forbidden: mergeForbidden(
            _get(pRuleSetExtended, 'forbidden', []),
            _get(pRuleSetBase, 'forbidden', [])
        ),
        allowed: mergeAllowed(
            _get(pRuleSetExtended, 'allowed', []),
            _get(pRuleSetBase, 'allowed', [])
        ),
        allowedSeverity: mergeAllowedSeverities(
            pRuleSetExtended,
            pRuleSetBase
        ),
        options: mergeOptions(
            _get(pRuleSetExtended, 'options', {}),
            _get(pRuleSetBase, 'options', {})
        )
    };

    return lRetval;
};
