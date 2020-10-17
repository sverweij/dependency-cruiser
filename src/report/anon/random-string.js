const _random = require("lodash/random");

const NUMBER = 0;
const SEPARATOR = 1;
const UPPERCASE = 2;
const NOTHING_SPECIAL = 3;

function isSeparator(pChar) {
  const lSeparatorsRe = /[-_.]/;

  return lSeparatorsRe.test(pChar);
}

function isUpperCase(pChar) {
  return pChar.toUpperCase() === pChar;
}

function classifyChar(pChar) {
  if (/\d/.test(pChar)) return NUMBER;
  if (isSeparator(pChar)) return SEPARATOR;
  if (isUpperCase(pChar)) return UPPERCASE;
  return NOTHING_SPECIAL;
}

function getRandomChar(pChar) {
  const lLowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
  const lMaxDecimalChar = 9;

  switch (classifyChar(pChar)) {
    case SEPARATOR:
      return pChar;
    case NUMBER:
      return _random(0, lMaxDecimalChar);
    case UPPERCASE:
      return lLowerCaseChars[
        _random(0, lLowerCaseChars.length - 1)
      ].toUpperCase();
    default:
      return lLowerCaseChars[_random(0, lLowerCaseChars.length - 1)];
  }
}
/**
 * Returns a random string with the same length as pString
 * acii characters - respecting case & numbers + leaving separators
 * (-, _, .) in place
 *
 * hello => tbkwd
 * randomString => ybmaecNtpmty
 * __interesting-stuff => __uuhfiitcvoq-rudbk
 * pulp2slurp => jgyb3guyow
 *
 * @param {string} pString - any string
 * @return {string} - a random string with above specs
 */
module.exports = function getRandomString(pString) {
  let lReturnValue = "";

  for (let lChar of pString) {
    lReturnValue += getRandomChar(lChar);
  }
  return lReturnValue;
};
