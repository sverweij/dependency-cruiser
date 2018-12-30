const tryRequire = require("semver-try-require");
const livescript = tryRequire(
    "livescript",
    require("../../../package.json").supportedTranspilers.livescript
);

/* istanbul ignore next */
module.exports = {
    isAvailable: () => livescript !== false,

    transpile: pSource =>
        livescript.compile(
            pSource
        )
};

/* eslint import/order: off */
