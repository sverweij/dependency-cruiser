"use strict";

const tryRequire = require("./tryRequire");
const livescript = tryRequire(
    "livescript",
    require("../../../package.json").supportedTranspilers.livescript
);

/* istanbul ignore next */
module.exports = {
    isAvailable: () => livescript !== false,

    transpile: pFile =>
        livescript.compile(
            pFile
        )
};

/* eslint import/order: off */
