const _random = require("lodash/random");

const NUMBER = 0;
const SEPARATOR = 1;
const UPPERCASE = 2;
const NOTHING_SPECIAL = 3;

function isSeparator(pChar) {
  const SEPARATORS_RE = /[-_.]/;

  return SEPARATORS_RE.test(pChar);
}

function isUpperCase(pChar) {
  return pChar.toUpperCase() === pChar;
}

function classifyChar(pChar) {
  if (/[0-9]/.test(pChar)) return NUMBER;
  if (isSeparator(pChar)) return SEPARATOR;
  if (isUpperCase(pChar)) return UPPERCASE;
  return NOTHING_SPECIAL;
}

function getRandomChar(pChar) {
  const LOWER_CASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
  const MAX_DECIMAL_CHAR = 9;

  switch (classifyChar(pChar)) {
    case SEPARATOR:
      return pChar;
    case NUMBER:
      return _random(0, MAX_DECIMAL_CHAR);
    case UPPERCASE:
      return LOWER_CASE_CHARS[
        _random(0, LOWER_CASE_CHARS.length - 1)
      ].toUpperCase();
    default:
      return LOWER_CASE_CHARS[_random(0, LOWER_CASE_CHARS.length - 1)];
  }
}
/**
 * Returns a random string with the same length as pString
 * acii characters - respecting case & numbers + leaving separators
 * (-, _, .) in place
 *
 * hello => tbkwd
 * randomString => ybmaecNtpmty
 * interestingStuff => __yhknuwxahjp-iblx
 * pulp2slurp => jgyb3guyow
 *
 * @param {string} pString - any string
 * @return {string} - a random string with above specs
 */
module.exports = function getRandomString(pString) {
  let lRetval = "";

  for (let i = 0; i < pString.length; i += 1) {
    // eslint-disable-next-line security/detect-object-injection
    lRetval += getRandomChar(pString[i]);
  }
  return lRetval;
};
