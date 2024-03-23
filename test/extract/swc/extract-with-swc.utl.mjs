import extractSwcDependencies from "#extract/swc/extract-swc-deps.mjs";
import { getASTFromSource } from "#extract/parse/to-swc-ast.mjs";

export default (pTypesScriptSource, pExoticRequireStrings = []) =>
  extractSwcDependencies(
    getASTFromSource(pTypesScriptSource),
    pExoticRequireStrings,
  );
