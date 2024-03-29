import extractTypescriptDependencies from "#extract/tsc/extract-typescript-deps.mjs";
import { getASTFromSource } from "#extract/tsc/parse.mjs";

export default (pTypesScriptSource, pExoticRequireStrings = []) =>
  extractTypescriptDependencies(
    getASTFromSource({ source: pTypesScriptSource }),
    pExoticRequireStrings,
  );
