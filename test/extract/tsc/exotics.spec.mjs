import { deepEqual } from "node:assert/strict";
import extractTypescript from "./extract-typescript.utl.mjs";

describe("[U] ast-extractors/extract-typescript - exotics", () => {
  it("doesn't detects 'exotic' dependencies when no exoticRequireStrings were passed", () => {
    deepEqual(
      extractTypescript(
        "const want = require; const yo = want('./required-with-want');",
        [],
      ),
      [],
    );
  });

  it("detects dependencies declared with one function names passed as exoticRequireStrings", () => {
    deepEqual(
      extractTypescript(
        "const want = need = require; const yo = want('./required-with-want'); const nope = need('./required-with-need');",
        ["want"],
      ),
      [
        {
          module: "./required-with-want",
          moduleSystem: "cjs",
          dynamic: false,
          exoticRequire: "want",
          exoticallyRequired: true,
          dependencyTypes: ["exotic-require"],
        },
      ],
    );
  });

  it("detects dependencies declared with member expression passed as exoticRequireStrings", () => {
    deepEqual(
      extractTypescript(
        "const yo = window.require('./required-with-window-require')",
        ["window.require"],
      ),
      [
        {
          module: "./required-with-window-require",
          moduleSystem: "cjs",
          dynamic: false,
          exoticRequire: "window.require",
          exoticallyRequired: true,
          dependencyTypes: ["exotic-require"],
        },
      ],
    );
  });

  it("detects dependencies declared with multiple function names passed as exoticRequireStrings", () => {
    deepEqual(
      extractTypescript(
        "const want = need = require; const yo = want('./required-with-want'); const nope = need('./required-with-need');",
        ["want", "need"],
      ),
      [
        {
          module: "./required-with-want",
          moduleSystem: "cjs",
          dynamic: false,
          exoticRequire: "want",
          exoticallyRequired: true,
          dependencyTypes: ["exotic-require"],
        },
        {
          module: "./required-with-need",
          moduleSystem: "cjs",
          dynamic: false,
          exoticRequire: "need",
          exoticallyRequired: true,
          dependencyTypes: ["exotic-require"],
        },
      ],
    );
  });

  it("detects dependencies declared with process.getBuiltinModule", () => {
    deepEqual(
      extractTypescript(
        "const path = process.getBuiltinModule('node:path');",
        [],
        // detectJSDocImports:
        false,
        // detectProcessBuiltinModuleCalls:
        true,
      ),
      [
        {
          module: "node:path",
          moduleSystem: "cjs",
          exoticallyRequired: false,
          dynamic: false,
          dependencyTypes: ["process-get-builtin-module"],
        },
      ],
    );
  });

  it("detects dependencies declared with globalThis.process.getBuiltinModule", () => {
    deepEqual(
      extractTypescript(
        "const path = globalThis.process.getBuiltinModule('node:path');",
        [],
        // detectJSDocImports:
        false,
        // detectProcessBuiltinModuleCalls:
        true,
      ),
      [
        {
          module: "node:path",
          moduleSystem: "cjs",
          exoticallyRequired: false,
          dynamic: false,
          dependencyTypes: ["process-get-builtin-module"],
        },
      ],
    );
  });

  it("doesn't detect dependencies declared with process.getBuiltinModule when the feature switch is off", () => {
    deepEqual(
      extractTypescript(
        "const path = process.getBuiltinModule('node:path');",
        [],
        // detectJSDocImports:
        false,
        // detectProcessBuiltinModuleCalls:
        false,
      ),
      [],
    );
  });
});
