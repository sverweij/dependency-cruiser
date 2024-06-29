import wrapAnsi from "wrap-ansi";

const DEFAULT_INDENT = 4;

function indentString(pString, pCount) {
  const lRegex = /^(?!\s*$)/gm;

  return pString.replace(lRegex, " ".repeat(pCount));
}

export default function wrapAndIndent(pString, pCount = DEFAULT_INDENT) {
  const lDogmaticMaxConsoleWidth = 78;
  const lMaxWidth = lDogmaticMaxConsoleWidth - pCount;

  return indentString(wrapAnsi(pString, lMaxWidth), pCount);
}
