import extractSwcDependencies from "#extract/ast-extractors/extract-swc-deps.mjs";
import { getASTFromSource } from "#extract/parse/to-swc-ast.mjs";

export default (pTypesScriptSource, pExoticRequireStrings = []) =>
  extractSwcDependencies(
    getASTFromSource(pTypesScriptSource),
    pExoticRequireStrings,
  );
