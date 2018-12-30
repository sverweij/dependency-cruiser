const extractTypescript = require('../../../src/extract/ast-extractors/extract-typescript-deps');
const getASTFromSource  = require('../../../src/extract/parse/toTypescriptAST').getASTFromSource;

module.exports = pTypesScriptSource => extractTypescript(getASTFromSource(pTypesScriptSource));
