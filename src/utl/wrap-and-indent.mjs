const DEFAULT_INDENT = 4;

function indentString(pString, pCount) {
  const lRegex = /^(?!\s*$)/gm;

  return pString.replace(lRegex, " ".repeat(pCount));
}

/**
 *
 * @param {string} pString - the string to wrap
 * @param {number} pMaxWidth - the maximum width of the wrapped string
 */
function wrapString(pString, pMaxWidth) {
  const lLines = pString.split(/\r?\n/);

  return lLines
    .map((pLine) => {
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
    })
    .join("\n");
}

export default function wrapAndIndent(pString, pCount = DEFAULT_INDENT) {
  const lDogmaticMaxConsoleWidth = 78;
  const lMaxWidth = lDogmaticMaxConsoleWidth - pCount;

  return indentString(wrapString(pString, lMaxWidth), pCount);
}
