import { deepEqual } from "node:assert/strict";
import extractTypescriptDependencies from "#extract/tsc/extract-typescript-deps.mjs";
import { getASTFromSource } from "#extract/tsc/parse.mjs";

// In javascript the native compiler adds what it derives from jsdoc (like
// imports from @import tags and types from @type and @param tags) to the
// AST as if it were regular code. For dependency-cruiser's purposes they
// still need to be jsdoc, though.
const JAVASCRIPT_SOURCE = `/** @import { Thing } from "./from-import-tag.mjs" */
/** @typedef {import("./from-typedef.mjs").Thang} Thang */
/**
 * @param {import("./from-param.mjs").Thung} pThung
 * @returns {Promise<import("./from-returns.mjs").Thong>}
 */
export function doThings(pThung) {
  return import("./dynamic-import.mjs");
}`;

function extractFromJavaScript(pSource, pDetectJSDocImports) {
  return extractTypescriptDependencies(
    getASTFromSource({ source: pSource, filename: "thing.mjs" }),
    [],
    pDetectJSDocImports,
  );
}

const DYNAMIC_IMPORT = {
  module: "./dynamic-import.mjs",
  moduleSystem: "es6",
  dynamic: true,
  exoticallyRequired: false,
  dependencyTypes: ["dynamic-import"],
};

function getJSDocBracketImport(pModuleName) {
  return {
    module: pModuleName,
    moduleSystem: "es6",
    dynamic: false,
    exoticallyRequired: false,
    dependencyTypes: ["type-only", "import", "jsdoc", "jsdoc-bracket-import"],
  };
}

describe("[U] ast-extractors/extract-typescript - jsdoc in javascript", () => {
  it("leaves imports in jsdoc alone when jsdoc import detection is off", () => {
    deepEqual(extractFromJavaScript(JAVASCRIPT_SOURCE, false), [
      DYNAMIC_IMPORT,
    ]);
  });

  it("extracts each import in jsdoc exactly once when jsdoc import detection is on", () => {
    deepEqual(extractFromJavaScript(JAVASCRIPT_SOURCE, true), [
      {
        module: "./from-import-tag.mjs",
        moduleSystem: "es6",
        dynamic: false,
        exoticallyRequired: false,
        dependencyTypes: ["type-only", "import", "jsdoc", "jsdoc-import-tag"],
      },
      getJSDocBracketImport("./from-typedef.mjs"),
      getJSDocBracketImport("./from-param.mjs"),
      getJSDocBracketImport("./from-returns.mjs"),
      DYNAMIC_IMPORT,
    ]);
  });
});
