const extractES6Deps = require('../../../src/extract/ast-extractors/extract-ES6-deps');
const getASTFromSource  = require('../../../src/extract/parse/toJavascriptAST').getASTFromSource;

module.exports = pJavaScriptSource => extractES6Deps(getASTFromSource(pJavaScriptSource, 'js'));
