import extractSwcDependencies from "#extract/swc/extract-swc-deps.mjs";
import { getASTFromSource } from "#extract/swc/parse.mjs";

export default (pTypesScriptSource, pExoticRequireStrings = []) =>
  extractSwcDependencies(
    getASTFromSource(pTypesScriptSource),
    pExoticRequireStrings,
  );
