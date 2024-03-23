import extractTypescript from "#extract/tsc/extract-typescript-deps.mjs";
import { getASTFromSource } from "#extract/tsc/parse.mjs";

export default (pTypesScriptSource, pExoticRequireStrings = []) =>
  extractTypescript(
    getASTFromSource({ source: pTypesScriptSource }),
    pExoticRequireStrings,
  );
