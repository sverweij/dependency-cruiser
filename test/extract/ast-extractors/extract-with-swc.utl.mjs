import extractSwcDependencies from "../../../src/extract/ast-extractors/extract-swc-deps.js";
import { getASTFromSource } from "../../../src/extract/parse/to-swc-ast.js";

export default (pTypesScriptSource, pExoticRequireStrings = []) =>
  extractSwcDependencies(
    getASTFromSource(pTypesScriptSource),
    pExoticRequireStrings
  );
