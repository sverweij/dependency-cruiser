import safeRegex from "safe-regex";
import { assertCruiseOptionsValid } from "../options/assert-validity.mjs";
import { normalizeToREAsString } from "../helpers.mjs";
import { bus } from "#utl/bus.mjs";
import { has, get } from "#utl/object-util.mjs";
import validateConfigurationSchema from "#schema/configuration.validate.mjs";
import { validateErrorsToString } from "#schema/utl.mjs";

/**
 * @import { IConfiguration } from "../../../types/configuration.mjs";
 */

// Bump safe-regex repeat limit to 10000 to avoid false positives
// for long pattern lists. This does not affect the star-height safety check.
const MAX_SAFE_REGEX_STAR_REPEAT_LIMIT = 10000;

function assertSchemaCompliance(pConfiguration) {
  if (!validateConfigurationSchema(pConfiguration)) {
    throw new Error(
      `The supplied configuration is not valid: ${validateErrorsToString(validateConfigurationSchema.errors)}.\n`,
    );
  }
}

function hasPath(pObject, pSection, pCondition) {
  // pCondition can be nested properties, so we use a bespoke
  // 'has' function instead of simple elvis operators
  return has(pObject, pSection) && has(pObject[pSection], pCondition);
}

function safeRule(pRule, pSection, pCondition) {
  if (hasPath(pRule, pSection, pCondition)) {
    return safeRegex(normalizeToREAsString(get(pRule[pSection], pCondition)), {
      limit: MAX_SAFE_REGEX_STAR_REPEAT_LIMIT,
    });
  }
  return true;
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
 * @param  {IConfiguration} pConfiguration The configuration to validate
 * @return {IConfiguration} The configuration as passed
 * @throws {Error}          An error with the reason for the error as a message
 */
export default function assertRuleSetValid(pConfiguration) {
  bus.debug("startup: parse rule set: validate");

  bus.trace("startup: parse rule set: validate: schema");
  assertSchemaCompliance(pConfiguration);

  bus.trace("startup: parse rule set: validate: rule safety");
  (pConfiguration.allowed || []).forEach(assertRuleSafety);
  (pConfiguration.forbidden || []).forEach(assertRuleSafety);

  bus.trace("startup: parse rule set: validate: options");
  if (pConfiguration?.options) {
    assertCruiseOptionsValid(pConfiguration.options);
  }
  return pConfiguration;
}

/* think we can ignore object injection here because it's not a public function */
/* eslint security/detect-object-injection: 0 */
