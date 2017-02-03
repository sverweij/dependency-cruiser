"use strict";

const tryRequire = require("./tryRequire");
const livescript = tryRequire(
    "livescript",
    require("../../../package.json").supportedTranspilers.livescript
);

exports.isAvailable = () => livescript !== false;

/* istanbul ignore next */
exports.transpile = pFile =>
    livescript.compile(
        pFile
    );
