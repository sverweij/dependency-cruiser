import { deepStrictEqual } from "node:assert";
import { describe, it } from "node:test";
import extractTypescript from "./extract-typescript.utl.mjs";

describe("[U] ast-extractors/extract-typescript - exotics", () => {
  it("doesn't detects 'exotic' dependencies when no exoticRequireStrings were passed", () => {
    deepStrictEqual(
      extractTypescript(
        "const want = require; const yo = want('./required-with-want');",
        []
      ),
      []
    );
  });

  it("detects dependencies declared with one function names passed as exoticRequireStrings", () => {
    deepStrictEqual(
      extractTypescript(
        "const want = need = require; const yo = want('./required-with-want'); const nope = need('./required-with-need');",
        ["want"]
      ),
      [
        {
          module: "./required-with-want",
          moduleSystem: "cjs",
          dynamic: false,
          exoticRequire: "want",
          exoticallyRequired: true,
        },
      ]
    );
  });

  it("detects dependencies declared with member expression passed as exoticRequireStrings", () => {
    deepStrictEqual(
      extractTypescript(
        "const yo = window.require('./required-with-window-require')",
        ["window.require"]
      ),
      [
        {
          module: "./required-with-window-require",
          moduleSystem: "cjs",
          dynamic: false,
          exoticRequire: "window.require",
          exoticallyRequired: true,
        },
      ]
    );
  });

  it("detects dependencies declared with multiple function names passed as exoticRequireStrings", () => {
    deepStrictEqual(
      extractTypescript(
        "const want = need = require; const yo = want('./required-with-want'); const nope = need('./required-with-need');",
        ["want", "need"]
      ),
      [
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
      ]
    );
  });
});
