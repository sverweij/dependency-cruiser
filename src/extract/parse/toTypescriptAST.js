"use strict";
const fs         = require('fs');
const tryRequire = require("semver-try-require");
const _memoize   = require("lodash/memoize");
const typescript = tryRequire(
    "typescript",
    require("../../../package.json").supportedTranspilers.typescript
);

function getASTFromSource(pTypescriptSource) {
    return typescript.createSourceFile(
        '$internal-file-name',
        pTypescriptSource,
        typescript.ScriptTarget.Latest,
        false
    );
}

function getAST(pFileName){
    return getASTFromSource(fs.readFileSync(pFileName, 'utf8'));
}

module.exports = {
    getASTFromSource,
    isAvailable: () => typescript !== false,
    getASTCached: _memoize(getAST)
};
