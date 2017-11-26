"use strict";
const tryRequire = require("./tryRequire");
const typescript = tryRequire(
    "typescript",
    require("../../../package.json").supportedTranspilers.typescript
);

module.exports = {
    isAvailable: () => typescript !== false,

    transpile: pFile =>
        typescript.transpileModule(
            pFile,
            {
                compilerOptions: {
                    "target": "es2015",
                    "jsx": "react"
                }
            }
        ).outputText
};

/* eslint import/order: off */
