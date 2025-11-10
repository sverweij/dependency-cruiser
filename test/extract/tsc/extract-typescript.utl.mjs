/* eslint-disable unicorn/prevent-abbreviations */
import extractTypescriptDependencies from "#extract/tsc/extract-typescript-deps.mjs";
import { getASTFromSource } from "#extract/tsc/parse.mjs";

export default (
  pTypesScriptSource,
  pExoticRequireStrings = [],
  pDetectJSDocImports = false,
  pDetectProcessBuiltinModuleCalls = false,
) =>
  extractTypescriptDependencies(
    getASTFromSource({ source: pTypesScriptSource }),
    pExoticRequireStrings,
    pDetectJSDocImports,
    pDetectProcessBuiltinModuleCalls,
  );
