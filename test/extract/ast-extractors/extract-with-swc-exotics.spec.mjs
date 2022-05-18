import { expect } from "chai";
import extractWithSwc from "./extract-with-swc.utl.mjs";

describe("[U] ast-extractors/extract-swc - exotics", () => {
  it("doesn't detects 'exotic' dependencies when no exoticRequireStrings were passed", () => {
    expect(
      extractWithSwc(
        "const want = require; const yo = want('./required-with-want');",
        []
      )
    ).to.deep.equal([]);
  });

  it("detects dependencies declared with one function names passed as exoticRequireStrings", () => {
    expect(
      extractWithSwc(
        "const want = need = require; const yo = want('./required-with-want'); const nope = need('./required-with-need');",
        ["want"]
      )
    ).to.deep.equal([
      {
        module: "./required-with-want",
        moduleSystem: "cjs",
        dynamic: false,
        exoticRequire: "want",
        exoticallyRequired: true,
      },
    ]);
  });

  it("detects dependencies declared with member expression passed as exoticRequireStrings", () => {
    expect(
      extractWithSwc(
        "const yo = window.require('./required-with-window-require')",
        ["window.require"]
      )
    ).to.deep.equal([
      {
        module: "./required-with-window-require",
        moduleSystem: "cjs",
        dynamic: false,
        exoticRequire: "window.require",
        exoticallyRequired: true,
      },
    ]);
  });

  it("ignores dependencies declared with member expressions that are not passed as exoticRequireStrings", () => {
    expect(
      extractWithSwc(
        "const yo = window.require('./required-with-window-require')",
        ["document.want"]
      )
    ).to.deep.equal([]);
  });

  it("detects dependencies declared with multiple function names passed as exoticRequireStrings", () => {
    expect(
      extractWithSwc(
        "const want = need = require; const yo = want('./required-with-want'); const nope = need('./required-with-need');",
        ["want", "need"]
      )
    ).to.deep.equal([
      {
        module: "./required-with-want",
        moduleSystem: "cjs",
        dynamic: false,
        exoticRequire: "want",
        exoticallyRequired: true,
      },
      {
        module: "./required-with-need",
        moduleSystem: "cjs",
        dynamic: false,
        exoticRequire: "need",
        exoticallyRequired: true,
      },
    ]);
  });
});
