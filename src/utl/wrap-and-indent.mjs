const DEFAULT_INDENT = 4;

function indentString(pString, pCount) {
  const lRegex = /^(?!\s*$)/gm;

  return pString.replace(lRegex, " ".repeat(pCount));
}

/**
 * @param {string} pLine
 * @param {number} pMaxWidth
 */
function splitLine(pLine, pMaxWidth) {
  const lWords = pLine.split(" ");
  const lWrappedLines = [];
  let lCurrentLine = "";
  let lCurrentWidth = 0;

  for (const lWord of lWords) {
    if (lCurrentWidth + lWord.length > pMaxWidth) {
      lWrappedLines.push(lCurrentLine.trimEnd());
      lCurrentLine = "";
      lCurrentWidth = 0;
    }

    if (lCurrentLine) {
      lCurrentLine += " ";
      lCurrentWidth += 1;
    }

    lCurrentLine += lWord;
    lCurrentWidth += lWord.length;
  }

  lWrappedLines.push(lCurrentLine.trimEnd());

  return lWrappedLines.join("\n");
}

/**
 * @param {string} pString - the string to wrap
 * @param {number} pMaxWidth - the maximum width of the wrapped string
 */
function wrapString(pString, pMaxWidth) {
  return pString
    .split(/\r?\n/)
    .map((pLine) => splitLine(pLine, pMaxWidth))
    .join("\n");
}

export default function wrapAndIndent(pString, pIndent = DEFAULT_INDENT) {
  const lMaxConsoleWidth = 78;
  const lMaxWidth = lMaxConsoleWidth - pIndent;

  return indentString(wrapString(pString, lMaxWidth), pIndent);
}
