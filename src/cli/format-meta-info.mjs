import { release, platform, arch } from "node:os";
import pc from "picocolors";

import { getAvailableTranspilers, allExtensions } from "#main/index.mjs";
import meta from "#meta.cjs";

function bool2Symbol(pBool) {
  return pBool ? pc.green("✔") : pc.red("x");
}

const MAX_VERSION_RANGE_STRING_LENGTH = 19;
const MAX_TRANSPILER_NAME_LENGTH = 22;
const MAX_VERSION_STRING_LENGTH = 24;

function formatTranspilers() {
  let lTranspilerTableHeader = pc.bold(
    `    ✔ ${"transpiler".padEnd(MAX_TRANSPILER_NAME_LENGTH)} ${"versions supported".padEnd(MAX_VERSION_RANGE_STRING_LENGTH)} version found`,
  );
  let lTranspilerTableDivider = `    - ${"-".repeat(MAX_TRANSPILER_NAME_LENGTH)} ${"-".repeat(MAX_VERSION_RANGE_STRING_LENGTH)} ${"-".repeat(MAX_VERSION_STRING_LENGTH)}`;
  let lTranspilerTable = getAvailableTranspilers()
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
  return `
    ${pc.bold("dependency-cruiser")}@${meta.version}

    node version supported : ${meta.engines.node}
    node version found     : ${process.version}
    os version found       : ${arch()} ${platform()}@${release()}

    If you need a supported, but not enabled transpiler ('${pc.red(
      "x",
    )}' below), just install
    it in the same folder dependency-cruiser is installed. E.g. 'npm i livescript'
    will enable livescript support if it's installed in your project folder.

${formatTranspilers()}
    ${pc.bold("✔ extension")}
    - ---------
${formatExtensions(allExtensions)}
`;
}

/* eslint security/detect-object-injection : 0 */
