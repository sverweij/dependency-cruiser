import pc from "picocolors";

import { getAvailableTranspilers, allExtensions } from "#main/index.mjs";

function bool2Symbol(pBool) {
  return pBool ? pc.green("✔") : pc.red("x");
}

function formatTranspilers() {
  return getAvailableTranspilers().reduce(
    (pAll, pThis) =>
      `${pAll}    ${bool2Symbol(pThis.available)} ${pThis.name} (${
        pThis.version
      })\n`,
    `    ${bool2Symbol(true)} javascript (>es1)\n`,
  );
}

function formatExtensions(pExtensions) {
  return pExtensions.reduce(
    (pAll, pThis) =>
      `${pAll}    ${bool2Symbol(pThis.available)} ${pThis.extension}\n`,
    "",
  );
}

export default function formatMetaInfo() {
  return `
  Supported:

    If you need a supported, but not enabled transpiler ('${pc.red(
      "x",
    )}' below), just install
    it in the same folder dependency-cruiser is installed. E.g. 'npm i livescript'
    will enable livescript support if it's installed in your project folder.

  Transpilers:

${formatTranspilers()}
  Extensions:

${formatExtensions(allExtensions)}
`;
}

/* eslint security/detect-object-injection : 0 */
