"use strict";
const tryRequire = require("semver-try-require");
const typescript = tryRequire(
    "typescript",
    require("../../../package.json").supportedTranspilers.typescript
);

module.exports = (pTsx) => ({
    isAvailable: () => typescript !== false,

    transpile: (pSource) => {
        let lCompilerOptions = {
            "target": "es2015"
        };

        if (pTsx){
            lCompilerOptions.jsx = "react";
        }

        return typescript.transpileModule(
            pSource,
            {
                compilerOptions: lCompilerOptions
            }
        ).outputText;
    }
});
