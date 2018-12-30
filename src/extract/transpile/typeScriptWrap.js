const tryRequire = require("semver-try-require");
const _get       = require('lodash/get');
const typescript = tryRequire(
    "typescript",
    require("../../../package.json").supportedTranspilers.typescript
);

function getCompilerOptions(pTsx, pTSConfig = {}) {
    let lCompilerOptions = {};

    if (pTsx){
        lCompilerOptions.jsx = "react";
    }

    return Object.assign(
        {"target": "es2015"},
        lCompilerOptions,
        _get(pTSConfig, "options", {})
    );
}

module.exports = (pTsx) => ({
    isAvailable: () => typescript !== false,

    transpile: (pSource, pTSConfig) => typescript.transpileModule(
        pSource,
        Object.assign(
            {},
            pTSConfig,
            {
                compilerOptions: getCompilerOptions(pTsx, pTSConfig)
            }
        )

    ).outputText
});
