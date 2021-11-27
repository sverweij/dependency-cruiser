import extractTypescript from "../../../src/extract/ast-extractors/extract-typescript-deps.js";
import { getASTFromSource } from "../../../src/extract/parse/to-typescript-ast.js";

export default (pTypesScriptSource, pExoticRequireStrings = []) =>
  extractTypescript(
    getASTFromSource({ source: pTypesScriptSource }),
    pExoticRequireStrings
  );
