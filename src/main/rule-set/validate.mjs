import Ajv from "ajv";
import safeRegex from "safe-regex";
import has from "lodash/has.js";
import { validateCruiseOptions } from "../options/validate.mjs";
import configurationSchema from "../../schema/configuration.schema.mjs";
import { normalizeToREAsString } from "../helpers.mjs";

const ajv = new Ajv();
// the default for this is 25 - as noted in the safe-regex source code already,
// the repeat limit is not the best of heuristics for indicating exponential time
// regular expressions - and it leads to false positives. E.g. if you use rules
// 'generated' from rules it could be the generated 'from' or 'to' have a list
// of file patterns that's easily > 25 of length. It's currently not possible
// to disable this check in safe-regex (e.g. by setting it to an odd value like
// 0 or -1, or by passing a 'switch this thing off please' option), so the only
// option is to increase the repeat limit to something fairly high.
//
// This does _not_ influence the star height algorithm, which is the main value
// of the safe-regex package.
const MAX_SAFE_REGEX_STAR_REPEAT_LIMIT = 10000;

function validateAgainstSchema(pSchema, pConfiguration) {
  if (!ajv.validate(pSchema, pConfiguration)) {
    throw new Error(
      `The supplied configuration is not valid: ${ajv.errorsText()}.\n`
    );
  }
}

function hasPath(pObject, pSection, pCondition) {
  return has(pObject, pSection) && has(pObject[pSection], pCondition);
}

function safeRule(pRule, pSection, pCondition) {
  return (
    !hasPath(pRule, pSection, pCondition) ||
    safeRegex(normalizeToREAsString(pRule[pSection][pCondition]), {
      limit: MAX_SAFE_REGEX_STAR_REPEAT_LIMIT,
    })
  );
}

function checkRuleSafety(pRule) {
  const lRegexConditions = [
    { section: "from", condition: "path" },
    { section: "to", condition: "path" },
    { section: "from", condition: "pathNot" },
    { section: "to", condition: "pathNot" },
    { section: "to", condition: "license" },
    { section: "to", condition: "licenseNot" },
    { section: "to", condition: "via" },
    { section: "to", condition: "viaNot" },
    { section: "to", condition: "viaOnly" },
    { section: "to", condition: "viaSomeNot" },
  ];

  if (
    lRegexConditions.some(
      (pCondition) => !safeRule(pRule, pCondition.section, pCondition.condition)
    )
  ) {
    throw new Error(
      `rule ${JSON.stringify(
        pRule,
        null,
        ""
      )} has an unsafe regular expression. Bailing out.\n`
    );
  }
}

/**
 * Returns the passed configuration pConfiguration when it is valid.
 * Throws an Error in all other cases.
 *
 * Validations:
 * - the ruleset adheres to the [config json schema](../../schema/configuration.schema.json)
 * - any regular expression in the rule set is 'safe' (~= won't be too slow)
 *
 * @param  {import("../../../types/configuration.js").IConfiguration} pConfiguration The configuration to validate
 * @return {import("../../../types/configuration.js").IConfiguration}  The configuration as passed
 * @throws {Error}                 An error with the reason for the error as
 *                                 a message
 */
export default function validateConfiguration(pConfiguration) {
  validateAgainstSchema(configurationSchema, pConfiguration);
  (pConfiguration.allowed || []).forEach(checkRuleSafety);
  (pConfiguration.forbidden || []).forEach(checkRuleSafety);
  if (has(pConfiguration, "options")) {
    validateCruiseOptions(pConfiguration.options);
  }
  return pConfiguration;
}

/* think we can ignore object injection here because it's not a public function */
/* eslint security/detect-object-injection: 0 */
