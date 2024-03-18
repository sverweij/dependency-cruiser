import Ajv from "ajv";
import safeRegex from "safe-regex";
import has from "lodash/has.js";
import get from "lodash/get.js";
import { assertCruiseOptionsValid } from "../options/assert-validity.mjs";
import { normalizeToREAsString } from "../helpers.mjs";
import configurationSchema from "#configuration-schema";

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

function assertSchemaCompliance(pSchema, pConfiguration) {
  if (!ajv.validate(pSchema, pConfiguration)) {
    throw new Error(
      `The supplied configuration is not valid: ${ajv.errorsText()}.\n`,
    );
  }
}

function hasPath(pObject, pSection, pCondition) {
  // pCondition can be nested properties, so we use lodash.has instead
  // of elvis operators
  return has(pObject, pSection) && has(pObject[pSection], pCondition);
}

function safeRule(pRule, pSection, pCondition) {
  return (
    !hasPath(pRule, pSection, pCondition) ||
    safeRegex(normalizeToREAsString(get(pRule[pSection], pCondition)), {
      limit: MAX_SAFE_REGEX_STAR_REPEAT_LIMIT,
    })
  );
}

function assertRuleSafety(pRule) {
  const lRegexConditions = [
    { section: "from", condition: "path" },
    { section: "to", condition: "path" },
    { section: "from", condition: "pathNot" },
    { section: "to", condition: "pathNot" },
    { section: "to", condition: "license" },
    { section: "to", condition: "licenseNot" },
    { section: "to", condition: "via" },
    { section: "to", condition: "via.path" },
    { section: "to", condition: "viaNot" },
    { section: "to", condition: "viaNot.path" },
    { section: "to", condition: "viaOnly" },
    { section: "to", condition: "viaOnly.path" },
    { section: "to", condition: "viaSomeNot" },
    { section: "to", condition: "viaSomeNot.path" },
  ];

  if (
    lRegexConditions.some(
      (pCondition) =>
        !safeRule(pRule, pCondition.section, pCondition.condition),
    )
  ) {
    throw new Error(
      `rule ${JSON.stringify(
        pRule,
        null,
        "",
      )} has an unsafe regular expression. Bailing out.\n`,
    );
  }
}

/**
 * Returns the passed configuration pConfiguration when it is valid.
 * Throws an Error in all other cases.
 *
 * Validations:
 * - the rule set adheres to the [config json schema](../../schema/configuration.schema.json)
 * - any regular expression in the rule set is 'safe' (~= won't be too slow)
 *
 * @param  {import("../../../types/configuration.js").IConfiguration} pConfiguration The configuration to validate
 * @return {import("../../../types/configuration.js").IConfiguration}  The configuration as passed
 * @throws {Error}                 An error with the reason for the error as
 *                                 a message
 */
export default function assertRuleSetValid(pConfiguration) {
  assertSchemaCompliance(configurationSchema, pConfiguration);
  (pConfiguration.allowed || []).forEach(assertRuleSafety);
  (pConfiguration.forbidden || []).forEach(assertRuleSafety);
  if (pConfiguration?.options) {
    assertCruiseOptionsValid(pConfiguration.options);
  }
  return pConfiguration;
}

/* think we can ignore object injection here because it's not a public function */
/* eslint security/detect-object-injection: 0 */
