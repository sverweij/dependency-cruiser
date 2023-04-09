import indentString from "indent-string";
import wrapAnsi from "wrap-ansi";

const DEFAULT_INDENT = 4;

export default function wrapAndIndent(pString, pIndent = DEFAULT_INDENT) {
  const lDogmaticMaxConsoleWidth = 78;
  const lMaxWidth = lDogmaticMaxConsoleWidth - pIndent;

  return indentString(wrapAnsi(pString, lMaxWidth), pIndent);
}
