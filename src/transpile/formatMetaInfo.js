"use strict";

const supportedTranspilers = require("../../package.json").supportedTranspilers;
const allExtensions        = require("./meta").allExtensions;
const tryRequire           = require("./tryRequire");
const chalk                = require('chalk');
const figures              = require('figures');

function bool2Symbol(pBool) {
    return pBool ? chalk.green(figures.tick) : chalk.red(figures.cross);
}

function formatTranspilers(pTranspilers) {
    return Object.keys(pTranspilers).reduce(
        (pAll, pThis) => `${pAll}    ${bool2Symbol(tryRequire(pThis))} ${pThis} (${pTranspilers[pThis]})\n`,
        `    ${bool2Symbol(true)} javascript (>es1)\n`
    );
}

function formatExtensions(pExtensions) {
    return pExtensions.reduce(
        (pAll, pThis) => `${pAll}    ${bool2Symbol(pThis.available)} ${pThis.extension}\n`,
        ""
    );
}

module.exports = () => `
  Supported:

    If you need a currently-not-enabled transpiler (those with a '${chalk.red(figures.cross)}'), just
    install it. E.g. 'npm install --save-dev livescript' will enable livescript
    support.

  Transpilers:

${formatTranspilers(supportedTranspilers)}
  Extensions:

${formatExtensions(allExtensions)}
`;


/* eslint security/detect-object-injection : 0 */
