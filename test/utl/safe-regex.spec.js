const expect = require("chai").expect;
const safeRegex = require("../../src/utl/safe-regex");

const REPETITION_LIMIT = 26;
const REPETITION_TOO_MUCH = REPETITION_LIMIT + 1;

describe("safe-regex", () => {
  const lValidNonMaliciousREs = [
    /\bOakland\b/,
    /\b(Oakland|San Francisco)\b/i,
    /^\d+1337\d+$/i,
    /^\d+(1337|404)\d+$/i,
    /^\d+(1337|404)*\d+$/i,
    /(a+)|(b+)/,
    RegExp(
      Array(REPETITION_LIMIT).join("a?") + Array(REPETITION_LIMIT).join("a")
    ),
    // String input.
    "aaa",
    /* eslint no-useless-escape:0 */
    "/^d+(1337|404)*d+$/",
    "^@types/query-string",
    // non-RE, non-string
    1
  ];

  /* eslint security/detect-unsafe-regex:0 */
  const lEvilREs = [
    /^(a?){25}(a){25}$/,
    RegExp(
      Array(REPETITION_TOO_MUCH).join("a?") +
        Array(REPETITION_TOO_MUCH).join("a")
    ),
    /(x+x+)+y/,
    /foo|(x+x+)+y/,
    /(a+){10}y/,
    /(a+){2}y/,
    /(.*){1,32000}[bc]/,
    // Star height with branching and nesting.
    /(a*|b)+$/,
    /(a|b*)+$/,
    /(((b*)))+$/,
    /(((b*))+)$/,
    // String input.
    "(a+)+"
  ];

  lValidNonMaliciousREs.forEach(pRegEx => {
    it(`${pRegEx} is evil`, () => {
      expect(safeRegex(pRegEx)).to.equal(true);
    });
  });

  lEvilREs.forEach(pRegEx => {
    it(`${pRegEx} is okidoki`, () => {
      expect(safeRegex(pRegEx)).to.equal(false);
    });
  });
});
