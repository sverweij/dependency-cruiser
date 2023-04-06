import { expect } from "chai";
import extractcommonJSDeps from "../../../src/extract/ast-extractors/extract-cjs-deps.mjs";
import { getASTFromSource } from "../../../src/extract/parse/to-javascript-ast.mjs";

const extractcommonJS = (
  pJavaScriptSource,
  pDependencies,
  pExoticRequireStrings = []
) =>
  extractcommonJSDeps(
    getASTFromSource({ source: pJavaScriptSource, extension: ".js" }),
    pDependencies,
    "cjs",
    pExoticRequireStrings
  );

describe("[U] ast-extractors/extract-cjs-deps", () => {
  it("require with in an assignment", () => {
    let lDeps = [];

    extractcommonJS("const x = require('./static')", lDeps);
    expect(lDeps).to.deep.equal([
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
      ["need"]
    );
    expect(lDeps).to.deep.equal([
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
      ["window.require"]
    );
    expect(lDeps).to.deep.equal([
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
      lDeps
    );
    expect(lDeps).to.deep.equal([]);
  });

  it("require with in an assignment - template literal argument", () => {
    let lDeps = [];

    extractcommonJS("const x = require(`template-literal`)", lDeps);
    expect(lDeps).to.deep.equal([
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
    expect(lDeps).to.deep.equal([]);
  });

  it("non-string argument doesn't yield a dependency (function call)", () => {
    let lDeps = [];

    extractcommonJS(
      `
            determineWhatToImport = () => 'bla';
            require(determineWhatToImport());
        `,
      lDeps
    );
    expect(lDeps).to.deep.equal([]);
  });
});
