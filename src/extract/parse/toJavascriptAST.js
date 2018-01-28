"use strict";

const fs           = require('fs');
const path         = require('path');
const acorn        = require('acorn');
const acorn_loose  = require('acorn/dist/acorn_loose');
const _memoize     = require('lodash/memoize');
const transpile    = require('../transpile');

/**
 * Returns the extension of the given file name path.
 *
 * Just using path.extname would be fine for most cases,
 * except for coffeescript, where a markdown extension can
 * mean literate coffeescript.
 *
 * @param {string} pFileName path to the file to be parsed
 * @return {string}          extension
 */
function getExtension(pFileName) {
    let lRetval = path.extname(pFileName);

    if (lRetval === ".md") {
        return pFileName.endsWith(".coffee.md") ? ".coffee.md" : lRetval;
    }
    return lRetval;
}

/**
 * Returns the abstract syntax tree of the module identified by the passed
 * file name. It obtains this by (1) transpiling the contents of the file
 * into javascript (if necessary) (2) parsing it.
 *
 * If parsing fails we fall back to acorn's 'loose' parser
 *
 * @param {string} pFileName path to the file to be parsed
 * @returns {object}         the abstract syntax tree
 */
function getAST(pFileName) {
    const lJavaScriptSource = transpile(
        getExtension(pFileName),
        fs.readFileSync(pFileName, 'utf8')
    );

    try {
        return acorn.parse(lJavaScriptSource, {sourceType: 'module'});
    } catch (e) {
        return acorn_loose.parse_dammit(lJavaScriptSource, {sourceType: 'module'});
    }
}
module.exports = {

    /**
     * Compiles the file identified by pFileName into a (javascript)
     * AST and returns it. Subsequent calls for the same file name will
     * return the result from a cache.
     *
     * @param {string} pFileName - the name of the file to compile
     * @return {object} - a (typescript) AST
     */
    getASTCached: _memoize(getAST)
};
