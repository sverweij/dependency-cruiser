import { deepEqual } from "node:assert/strict";
import extractcommonJSDeps from "../../../src/extract/ast-extractors/extract-cjs-deps.mjs";
import { getASTFromSource } from "../../../src/extract/parse/to-javascript-ast.mjs";

const extractcommonJS = (
  pJavaScriptSource,
  pDependencies,
  pExoticRequireStrings = [],
) =>
  extractcommonJSDeps(
    getASTFromSource({ source: pJavaScriptSource, extension: ".js" }),
    pDependencies,
    "cjs",
    pExoticRequireStrings,
  );

describe("[U] ast-extractors/extract-cjs-deps", () => {
  it("require with in an assignment", () => {
    let lDeps = [];

    extractcommonJS("const x = require('./static')", lDeps);
    deepEqual(lDeps, [
      {
        module: "./static",
        moduleSystem: "cjs",
        dynamic: false,
        exoticallyRequired: false,
      },
    ]);
  });

  it("use an exotic require and specify it as exoticRequireString", () => {
    let lDeps = [];

    extractcommonJS(
      "const need = require; const x = need('./static-required-with-need')",
      lDeps,
      ["need"],
    );
    deepEqual(lDeps, [
      {
        module: "./static-required-with-need",
        moduleSystem: "cjs",
        dynamic: false,
        exoticRequire: "need",
        exoticallyRequired: true,
      },
    ]);
  });

  it("use an exotic combined require and specify it as exoticRequireString", () => {
    let lDeps = [];

    extractcommonJS(
      "const x = window.require('./static-required-with-need')",
      lDeps,
      ["window.require"],
    );
    deepEqual(lDeps, [
      {
        module: "./static-required-with-need",
        moduleSystem: "cjs",
        dynamic: false,
        exoticRequire: "window.require",
        exoticallyRequired: true,
      },
    ]);
  });

  it("use an exotic require and don't specify it as exoticRequireString", () => {
    let lDeps = [];

    extractcommonJS(
      "const need = require; const x = need('./static-required-with-need')",
      lDeps,
    );
    deepEqual(lDeps, []);
  });

  it("require with in an assignment - template literal argument", () => {
    let lDeps = [];

    extractcommonJS("const x = require(`template-literal`)", lDeps);
    deepEqual(lDeps, [
      {
        module: "template-literal",
        moduleSystem: "cjs",
        dynamic: false,
        exoticallyRequired: false,
      },
    ]);
  });

  it("non-string argument doesn't yield a dependency (number)", () => {
    let lDeps = [];

    extractcommonJS("require(42);", lDeps);
    deepEqual(lDeps, []);
  });

  it("non-string argument doesn't yield a dependency (function call)", () => {
    let lDeps = [];

    extractcommonJS(
      `
            determineWhatToImport = () => 'bla';
            require(determineWhatToImport());
        `,
      lDeps,
    );
    deepEqual(lDeps, []);
  });
});
