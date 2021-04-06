const extractSwcDependencies = require("../../../src/extract/ast-extractors/extract-swc-deps");
const { getASTFromSource } = require("../../../src/extract/parse/to-swc-ast");

module.exports = (pTypesScriptSource, pExoticRequireStrings = []) =>
  extractSwcDependencies(
    getASTFromSource(pTypesScriptSource),
    pExoticRequireStrings
  );
