/* eslint-disable unicorn/prevent-abbreviations */
import extractTypescriptDependencies from "#extract/tsc/extract-typescript-deps.mjs";
import { getASTFromSource } from "#extract/tsc/parse.mjs";

export default (
  pTypeScriptSource,
  pExoticRequireStrings = [],
  pDetectJSDocImports = false,
  pDetectProcessBuiltinModuleCalls = false,
  pDetectImportsInAmbientModules = false,
) =>
  extractTypescriptDependencies(
    getASTFromSource({ source: pTypeScriptSource }),
    pExoticRequireStrings,
    pDetectJSDocImports,
    pDetectProcessBuiltinModuleCalls,
    pDetectImportsInAmbientModules,
  );
