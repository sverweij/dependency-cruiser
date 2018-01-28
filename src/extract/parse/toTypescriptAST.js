"use strict";
const fs         = require('fs');
const tryRequire = require("semver-try-require");
const _memoize   = require("lodash/memoize");
const typescript = tryRequire(
    "typescript",
    require("../../../package.json").supportedTranspilers.typescript
);

function getASTFromSource(pTypescriptSource, pFileName) {
    return typescript.createSourceFile(
        pFileName || '$internal-file-name',
        pTypescriptSource,
        typescript.ScriptTarget.Latest,
        false
    );
}

function getAST(pFileName){
    return getASTFromSource(
        fs.readFileSync(pFileName, 'utf8'),
        pFileName
    );
}

module.exports = {
    getASTFromSource,
    isAvailable: () => typescript !== false,
    getASTCached: _memoize(getAST)
};
