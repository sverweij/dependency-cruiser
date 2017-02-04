"use strict";

const javaScriptWrap       = require("./javaScriptWrap");
const typeScriptWrap       = require("./typeScriptWrap");
const liveScriptWrap       = require("./liveScriptWrap");
const coffeeWrap           = require("./coffeeWrap")();
const litCoffeeWrap        = require("./coffeeWrap")(true);
const supportedTranspilers = require("../../../package.json").supportedTranspilers;

const extension2wrapper = {
    ".js"        : javaScriptWrap,
    ".ts"        : typeScriptWrap,
    ".d.ts"      : typeScriptWrap,
    ".ls"        : liveScriptWrap,
    ".coffee"    : coffeeWrap,
    ".litcoffee" : litCoffeeWrap,
    ".coffee.md" : litCoffeeWrap
};

const transpiler2wrapper = {
    "javascript"    : javaScriptWrap,
    "coffee-script" : coffeeWrap,
    "livescript"    : liveScriptWrap,
    "typescript"    : typeScriptWrap
};

module.exports.getWrapper =
    pExtension => extension2wrapper[pExtension] || javaScriptWrap;

module.exports.allExtensions =
    Object.keys(extension2wrapper)
        .map(
            pKey => ({
                extension: pKey,
                available: extension2wrapper[pKey].isAvailable()
            })
        );

module.exports.scannableExtensions =
    Object.keys(extension2wrapper)
        .filter(
            pKey => extension2wrapper[pKey].isAvailable()
        );

module.exports.getAvailableTranspilers =
    () =>
        Object.keys(supportedTranspilers).map(pTranspiler => ({
            name: pTranspiler,
            version: supportedTranspilers[pTranspiler],
            available: transpiler2wrapper[pTranspiler].isAvailable()
        })
    );

/* eslint security/detect-object-injection : 0*/
