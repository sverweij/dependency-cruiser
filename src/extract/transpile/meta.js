const supportedTranspilers = require("../../../package.json").supportedTranspilers;
const javaScriptWrap       = require("./javaScriptWrap");
const typeScriptWrap       = require("./typeScriptWrap")();
const tsxWrap              = require("./typeScriptWrap")(true);
const liveScriptWrap       = require("./liveScriptWrap");
const coffeeWrap           = require("./coffeeWrap")();
const litCoffeeWrap        = require("./coffeeWrap")(true);

/*
  jsx - acorn_loose will handle this correctly when imports
        etc are on top, which is the most likely use case.
        Alternatives (making a jsxWrap with babel-core & a bunch
        of plugins or using acorn-jsx) might be more correct in
        edge cases but are either much harder to implement or
        likely to fail in basic use cases.

        See ./jsxImplementationRationale.md for an implementation
        rationale on jsx ...
 */
const extension2wrapper = {
    ".js"        : javaScriptWrap,
    ".mjs"       : javaScriptWrap,
    ".jsx"       : javaScriptWrap,
    ".vue"       : javaScriptWrap,
    ".ts"        : typeScriptWrap,
    ".tsx"       : tsxWrap,
    ".d.ts"      : typeScriptWrap,
    ".ls"        : liveScriptWrap,
    ".coffee"    : coffeeWrap,
    ".litcoffee" : litCoffeeWrap,
    ".coffee.md" : litCoffeeWrap,
    ".csx"       : coffeeWrap,
    ".cjsx"      : coffeeWrap
};

const transpiler2wrapper = {
    "javascript"    : javaScriptWrap,
    "coffee-script" : coffeeWrap,
    "coffeescript"  : coffeeWrap,
    "livescript"    : liveScriptWrap,
    "typescript"    : typeScriptWrap
};

/**
 * returns the wrapper module configured for the extension pExtension.
 *
 * returns the javascript wrapper if there's no wrapper module configured
 * for the extension.
 *
 * @param {string}  pExtension the extension (e.g. ".ts", ".js", ".litcoffee")
 * @returns {module} the module
 */
module.exports.getWrapper =
    pExtension => extension2wrapper[pExtension] || javaScriptWrap;

/**
 * all supported extensions and whether or not it is supported
 * in the current environment
 *
 * @type {array}
 */
module.exports.allExtensions =
    Object.keys(extension2wrapper)
        .map(
            pKey => ({
                extension: pKey,
                available: extension2wrapper[pKey].isAvailable()
            })
        );

/**
 * an array of extensions that are 'scannable' (have a valid transpiler
 * available for) in the current environemnt.
 *
 * @type {array}
 */
module.exports.scannableExtensions =
    Object.keys(extension2wrapper)
        .filter(
            pKey => extension2wrapper[pKey].isAvailable()
        );

/**
 * returns an array of supported transpilers, whith for each transpiler:
 * - the version (range) supported
 * - whether or not it is available in the current environment
 *
 * @returns {array} an array of supported transpilers
 */
module.exports.getAvailableTranspilers =
    () =>
        Object.keys(supportedTranspilers).map(pTranspiler => ({
            name: pTranspiler,
            version: supportedTranspilers[pTranspiler],
            available: transpiler2wrapper[pTranspiler].isAvailable()
        })
        );

/* eslint security/detect-object-injection : 0*/
