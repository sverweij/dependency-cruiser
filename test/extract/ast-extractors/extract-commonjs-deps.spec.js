const expect = require("chai").expect;
const extractcommonJSDeps = require("../../../src/extract/ast-extractors/extract-commonJS-deps");
const getASTFromSource = require("../../../src/extract/parse/toJavascriptAST")
  .getASTFromSource;

const extractcommonJS = (
  pJavaScriptSource,
  pDependencies,
  pExoticRequireStrings = []
) =>
  extractcommonJSDeps(
    getASTFromSource(pJavaScriptSource, "js"),
    pDependencies,
    "cjs",
    pExoticRequireStrings
  );

describe("ast-extractors/extract-commonJS-deps", () => {
  it("require with in an assignment", () => {
    let lDeps = [];

    extractcommonJS("const x = require('./static')", lDeps);
    expect(lDeps).to.deep.equal([
      {
        moduleName: "./static",
        moduleSystem: "cjs",
        dynamic: false
      }
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
        moduleName: "./static-required-with-need",
        moduleSystem: "cjs",
        dynamic: false,
        exoticRequire: "need"
      }
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
        moduleName: "template-literal",
        moduleSystem: "cjs",
        dynamic: false
      }
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
