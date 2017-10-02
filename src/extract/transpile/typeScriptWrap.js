"use strict";
const tryRequire = require("./tryRequire");
const typescript = tryRequire(
    "typescript",
    require("../../../package.json").supportedTranspilers.typescript
);

exports.isAvailable = () => typescript !== false;

exports.transpile = pFile =>
    typescript.transpileModule(
        pFile,
        {
            compilerOptions: {
                "target": "es2015",
                "jsx": "react"
            }
        }
    ).outputText;
