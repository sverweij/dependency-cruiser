const indentString = require("indent-string");
const wrapAnsi = require("wrap-ansi");

const DEFAULT_INDENT = 4;
module.exports = function wrapAndIndent(pString, pIndent = DEFAULT_INDENT) {
  const DOGMATIC_MAX_CONSOLE_WIDTH = 78;
  const MAX_WIDTH = DOGMATIC_MAX_CONSOLE_WIDTH - pIndent;

  return indentString(wrapAnsi(pString, MAX_WIDTH), pIndent);
};
