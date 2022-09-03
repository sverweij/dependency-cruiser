const { readFileSync } = require("fs");
const json5 = require("json5");
const makeAbsolute = require("./make-absolute");

module.exports = function extractKnownViolations(pKnownViolationsFileName) {
  try {
    return json5.parse(
      readFileSync(makeAbsolute(pKnownViolationsFileName), "utf8")
    );
    // TODO: apparently node12 native coverage doesn't see this is covered with UT
    //      (node 14 and 16 do), so c8 doesn't either. The ignore can be removed
    //      once we stop supporting node 12
    /* c8 ignore start */
  } catch (pError) {
    if (pError instanceof SyntaxError) {
      throw new SyntaxError(
        `'${pKnownViolationsFileName}' should be valid json\n          ${pError}`
      );
    }
    throw pError;
  }
  /* c8 ignore stop */

  // TODO: validate the json against the schme? (might be more clear to do it here,
  // even if (in context of the cli) it's done again when validating the whole
  // config
};
