const util = require("util");
const _get = require("lodash/get");
const _uniqBy = require("lodash/uniqBy");
const _uniqWith = require("lodash/uniqWith");

function extendNamedRule(pExtendedRule, pForbiddenArrayBase) {
  return pForbiddenArrayBase
    .filter((pBaseRule) => pBaseRule.name === pExtendedRule.name)
    .reduce(
      (pAll, pBaseRule) => ({
        ...pBaseRule,
        ...pAll,
      }),
      pExtendedRule
    );
}

/**
 * Extends the given pForbiddenArrayBase with the pForbiddenArrayExtended.
 *
 * Conflict resolution:
 * - if the rule is anonymous: unique on the complete content of the rule
 * - if the rule has a name: unique by that name (where the same name
 *   rules get merged, where individual attributes of the named rules
 *   in pForbiddenArrayExtended win)
 *
 * @param {*} pRuleArrayExtended - array of 'fobidden' rules that extend the ...
 * @param {*} pRuleArrayBase - array of 'forbidden' rules to extend
 *
 * @return {Array} - the merged array
 */
function mergeRules(pRuleArrayExtended, pRuleArrayBase) {
  // merge anonymous on 100% equality
  let lAnonymousRules = _uniqWith(
    pRuleArrayExtended.concat(pRuleArrayBase).filter((pRule) => !pRule.name),
    util.isDeepStrictEqual
  );

  let lNamedRules = pRuleArrayExtended
    .filter((pRule) => pRule.name)
    .map((pNamedRule) => extendNamedRule(pNamedRule, pRuleArrayBase));

  // merge named rules based on unique name
  lNamedRules = _uniqBy(
    // ordered extended => base because the uniqBy picks the
    // first it encounters and we want the ones from the
    // extended in case of a conflict

    // the other concats (anonymous, allowed) don't need it
    // but have it to be consistent with this
    lNamedRules.concat(pRuleArrayBase).filter((pRule) => pRule.name),
    (pRule) => pRule.name
  );

  return lNamedRules.concat(lAnonymousRules);
}

/**
 * Extends the given pAllowedArrayBase with the pAllowedArrayExtended.
 *
 * Conflict resolution: unique on the complete content of the rule
 *
 * @param {*} pAllowedArrayExtended - array of 'allowed' rules that extend the ///
 * @param {*} pAllowedArrayBase - array of 'allowed' rules to extend
 *
 * @return {Array} - the merged array
 */
function mergeAllowedRules(pAllowedArrayExtended, pAllowedArrayBase) {
  return _uniqWith(
    pAllowedArrayExtended.concat(pAllowedArrayBase),
    util.isDeepStrictEqual
  );
}

function mergeOptions(pOptionsExtended, pOptionsBase) {
  // TODO: make implementation less naive (?)
  return { ...pOptionsBase, ...pOptionsExtended };
}

/**
 * returns the severity for the allowed rule - and "warn" if neither
 * passed dependency-cruiser configs contain it.
 *
 * @param {*} pConfigExtended - a dependency-cruiser-config that extends ...
 * @param {*} pConfigBase - a base dependency-cruiser-config
 *
 * @returns {string} - a string from the SeverityType value set
 */
function mergeAllowedSeverities(pConfigExtended, pConfigBase) {
  return _get(
    pConfigExtended,
    "allowedSeverity",
    _get(pConfigBase, "allowedSeverity", "warn")
  );
}

/**
 * Merges the extended rule set into the base:
 *
 * - forbidden and allowed rules arrays get concat'ed and uniq'd
 * - named forbidden rules from the extended set 'win' from the ones
 *   with the same in name in the base set
 * - for the allowedSeverity the extended one 'wins' - if none is present it
 *   gets to be 'warn'
 * - options get simply object assigned
 * @param {*} pConfigExtended - a dependency-cruiser-config that extends ...
 * @param {*} pConfigBase - a base dependency-cruiser-config
 *
 * @returns {Object} - The merged rule set
 */
module.exports = (pConfigExtended, pConfigBase) => {
  const lForbidden = mergeRules(
    _get(pConfigExtended, "forbidden", []),
    _get(pConfigBase, "forbidden", [])
  );
  const lRequired = mergeRules(
    _get(pConfigExtended, "required", []),
    _get(pConfigBase, "required", [])
  );
  const lAllowed = mergeAllowedRules(
    _get(pConfigExtended, "allowed", []),
    _get(pConfigBase, "allowed", [])
  );

  return {
    ...(lForbidden.length > 0 ? { forbidden: lForbidden } : {}),
    ...(lRequired.length > 0 ? { required: lRequired } : {}),
    ...(lAllowed.length > 0
      ? {
          allowed: lAllowed,
          allowedSeverity: mergeAllowedSeverities(pConfigExtended, pConfigBase),
        }
      : {}),
    options: mergeOptions(
      _get(pConfigExtended, "options", {}),
      _get(pConfigBase, "options", {})
    ),
  };
};
