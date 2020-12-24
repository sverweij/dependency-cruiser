const chalk = require("chalk");
const figures = require("figures");
const main = require("../main");

function bool2Symbol(pBool) {
  return pBool ? chalk.green(figures.tick) : chalk.red(figures.cross);
}

function formatTranspilers() {
  return main
    .getAvailableTranspilers()
    .reduce(
      (pAll, pThis) =>
        `${pAll}    ${bool2Symbol(pThis.available)} ${pThis.name} (${
          pThis.version
        })\n`,
      `    ${bool2Symbol(true)} javascript (>es1)\n`
    );
}

function formatExtensions(pExtensions) {
  return pExtensions.reduce(
    (pAll, pThis) =>
      `${pAll}    ${bool2Symbol(pThis.available)} ${pThis.extension}\n`,
    ""
  );
}

module.exports = function formatMetaInfo() {
  return `
  Supported:

    If you need a supported, but not enabled transpiler ('${chalk.red(
      figures.cross
    )}' below), just install
    it in the same folder dependency-cruiser is installed. E.g. 'npm i livescript'
    will enable livescript support if it's installed in your project folder.

  Transpilers:

${formatTranspilers()}
  Extensions:

${formatExtensions(main.allExtensions)}
`;
};

/* eslint security/detect-object-injection : 0 */
