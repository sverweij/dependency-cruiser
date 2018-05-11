"use strict";
const tryRequire = require("semver-try-require");
const typescript = tryRequire(
    "typescript",
    require("../../../package.json").supportedTranspilers.typescript
);

module.exports = {
    isAvailable: () => typescript !== false,

    transpile: pSource =>
        typescript.transpileModule(
            pSource,
            {
                compilerOptions: {
                    "target": "es2015",
                    "jsx": "react"
                }
            }
        ).outputText
};
