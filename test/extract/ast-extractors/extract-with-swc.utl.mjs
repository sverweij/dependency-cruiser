import extractSwcDependencies from "../../../src/extract/ast-extractors/extract-swc-deps.mjs";
import { getASTFromSource } from "../../../src/extract/parse/to-swc-ast.mjs";

export default (pTypesScriptSource, pExoticRequireStrings = []) =>
  extractSwcDependencies(
    getASTFromSource(pTypesScriptSource),
    pExoticRequireStrings
  );
