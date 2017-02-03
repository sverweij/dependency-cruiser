"use strict";

const javaScriptWrap = require("./javaScriptWrap");
const typeScriptWrap = require("./typeScriptWrap");
const liveScriptWrap = require("./liveScriptWrap");
const coffeeWrap     = require("./coffeeWrap")();
const litCoffeeWrap  = require("./coffeeWrap")(true);

const extension2wrapper = {
    ".js"        : javaScriptWrap,
    ".ts"        : typeScriptWrap,
    ".d.ts"      : typeScriptWrap,
    ".ls"        : liveScriptWrap,
    ".coffee"    : coffeeWrap,
    ".litcoffee" : litCoffeeWrap,
    ".coffee.md" : litCoffeeWrap
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

/* eslint security/detect-object-injection : 0*/
