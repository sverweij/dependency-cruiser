"use strict";

const tryRequire = require("./tryRequire");
const livescript = tryRequire(
    "livescript",
    require("../../../package.json").supportedTranspilers.livescript
);

module.exports = {
    isAvailable: () => livescript !== false,

    /* istanbul ignore next */
    transpile: pFile =>
        livescript.compile(
            pFile
        )
};
