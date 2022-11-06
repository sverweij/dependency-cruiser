const { readFileSync } = require("fs");
const json5 = require("json5");
const makeAbsolute = require("./make-absolute");

module.exports = function extractKnownViolations(pKnownViolationsFileName) {
  try {
    return json5.parse(
      readFileSync(makeAbsolute(pKnownViolationsFileName), "utf8")
    );
  } catch (pError) {
    if (pError instanceof SyntaxError) {
      throw new SyntaxError(
        `'${pKnownViolationsFileName}' should be valid json\n          ${pError}`
      );
    }
    throw pError;
  }

  // TODO: validate the json against the schema? (might be more clear to do it here,
  // even if (in context of the cli) it's done again when validating the whole
  // config
};
