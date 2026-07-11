import { styleText } from "node:util";
import { getEnvironmentInfo } from "#environment.mjs";

function bool2Symbol(pBool) {
  return pBool ? styleText("green", "✔") : styleText("red", "x");
}

const MAX_VERSION_RANGE_STRING_LENGTH = 19;
const MAX_TRANSPILER_NAME_LENGTH = 22;
const MAX_VERSION_STRING_LENGTH = 24;

function formatTranspilers(pAvailableTranspilers) {
  let lTranspilerTableHeader = styleText(
    "bold",
    `    ✔ ${"transpiler".padEnd(MAX_TRANSPILER_NAME_LENGTH)} ${"versions supported".padEnd(MAX_VERSION_RANGE_STRING_LENGTH)} version found`,
  );
  let lTranspilerTableDivider = `    - ${"-".repeat(MAX_TRANSPILER_NAME_LENGTH)} ${"-".repeat(MAX_VERSION_RANGE_STRING_LENGTH)} ${"-".repeat(MAX_VERSION_STRING_LENGTH)}`;
  let lTranspilerTable = pAvailableTranspilers
    .map(
      (pTranspiler) =>
        `    ${bool2Symbol(pTranspiler.available)} ${pTranspiler.name.padEnd(MAX_TRANSPILER_NAME_LENGTH)} ${pTranspiler.version.padEnd(MAX_VERSION_RANGE_STRING_LENGTH)} ${pTranspiler.currentVersion}`,
    )
    .join("\n");
  return `${lTranspilerTableHeader}\n${lTranspilerTableDivider}\n${lTranspilerTable}\n`;
}

function formatExtensions(pExtensions) {
  return pExtensions.reduce(
    (pAll, pThis) =>
      `${pAll}    ${bool2Symbol(pThis.available)} ${pThis.extension}\n`,
    "",
  );
}

export default function formatMetaInfo() {
  const lMetaInfo = getEnvironmentInfo();
  return `
    ${styleText("bold", "dependency-cruiser")}@${lMetaInfo.version}

    node version supported : ${lMetaInfo.nodeVersionSupported}
    node version found     : ${lMetaInfo.nodeVersionFound}
    os version found       : ${lMetaInfo.osVersionFound}

    If you need a supported, but not enabled transpiler ('${styleText(
      "red",
      "x",
    )}' below), just install
    it in the same folder dependency-cruiser is installed. E.g. 'npm i livescript'
    will enable livescript support if it's installed in your project folder.

${formatTranspilers(lMetaInfo.transpilersFound)}
    ${styleText("bold", "✔ extension")}
    - ---------
${formatExtensions(lMetaInfo.extensionsFound)}
`;
}

/* eslint security/detect-object-injection : 0 */
