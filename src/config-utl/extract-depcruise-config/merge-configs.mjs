import { isDeepStrictEqual } from "node:util";
import uniqBy from "lodash/uniqBy.js";
import uniqWith from "lodash/uniqWith.js";

function extendNamedRule(pExtendedRule, pForbiddenArrayBase) {
  return pForbiddenArrayBase
    .filter(({ name }) => name === pExtendedRule.name)
    .reduce(
      (pAll, pBaseRule) => ({
        ...pBaseRule,
        ...pAll,
      }),
      pExtendedRule,
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
 * @param {*} pRuleArrayExtended - array of 'forbidden' rules that extend the ...
 * @param {*} pRuleArrayBase - array of 'forbidden' rules to extend
 *
 * @return {Array} - the merged array
 */
function mergeRules(pRuleArrayExtended, pRuleArrayBase) {
  // merge anonymous on 100% equality
  let lAnonymousRules = uniqWith(
    pRuleArrayExtended.concat(pRuleArrayBase).filter(({ name }) => !name),
    isDeepStrictEqual,
  );

  let lNamedRules = pRuleArrayExtended
    .filter(({ name }) => name)
    .map((pNamedRule) => extendNamedRule(pNamedRule, pRuleArrayBase));

  // merge named rules based on unique name
  lNamedRules = uniqBy(
    // ordered extended => base because the uniqBy picks the
    // first it encounters and we want the ones from the
    // extended in case of a conflict

    // the other concats (anonymous, allowed) don't need it
    // but have it to be consistent with this
    lNamedRules.concat(pRuleArrayBase).filter(({ name }) => name),
    ({ name }) => name,
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
  return uniqWith(
    pAllowedArrayExtended.concat(pAllowedArrayBase),
    isDeepStrictEqual,
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
  return (
    pConfigExtended?.allowedSeverity ?? pConfigBase?.allowedSeverity ?? "warn"
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
// eslint-disable-next-line complexity
export default (pConfigExtended, pConfigBase) => {
  const lForbidden = mergeRules(
    pConfigExtended?.forbidden ?? [],
    pConfigBase?.forbidden ?? [],
  );
  const lRequired = mergeRules(
    pConfigExtended?.required ?? [],
    pConfigBase?.required ?? [],
  );
  const lAllowed = mergeAllowedRules(
    pConfigExtended?.allowed ?? [],
    pConfigBase?.allowed ?? [],
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
      pConfigExtended?.options ?? {},
      pConfigBase?.options ?? {},
    ),
  };
};
