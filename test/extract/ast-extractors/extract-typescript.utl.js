const extractTypescript = require("../../../src/extract/ast-extractors/extract-typescript-deps");
const {
  getASTFromSource,
} = require("../../../src/extract/parse/to-typescript-ast");

module.exports = (pTypesScriptSource, pExoticRequireStrings = []) =>
  extractTypescript(
    getASTFromSource(pTypesScriptSource),
    pExoticRequireStrings
  );
