import { equal } from "node:assert/strict";
import { isBuiltin } from "#extract/resolve/is-built-in.mjs";

describe("[U] extract/resolve/is-built-in - isBuiltIn", () => {
  it("should return true for built-in modules", () => {
    const lModuleName = "fs";
    const lResolveOptions = {};

    const lResult = isBuiltin(lModuleName, lResolveOptions);

    equal(lResult, true);
  });

  it("should return false for non-built-in modules", () => {
    const lModuleName = "my-module";
    const lResolveOptions = {};

    const lResult = isBuiltin(lModuleName, lResolveOptions);

    equal(lResult, false);
  });

  it("should return true for Bun built-in modules with bun: protocol", () => {
    const lModuleName = "bun:test";
    const lResolveOptions = {};

    const lResult = isBuiltin(lModuleName, lResolveOptions);

    equal(lResult, true);
  });

  it("should use additional built-ins if provided", () => {
    const lModuleName = "electron";
    const lResolveOptions = {
      builtInModules: {
        add: [lModuleName],
      },
    };

    const lResult = isBuiltin(lModuleName, lResolveOptions);

    equal(lResult, true);
  });

  it("should override default built-ins with custom built-ins", () => {
    const lModuleName = "overridden";
    const lResolveOptions = {
      builtInModules: {
        override: [lModuleName],
      },
    };

    const lResultOverridden = isBuiltin(lModuleName, lResolveOptions);
    const lResultForFs = isBuiltin("fs", lResolveOptions);

    equal(lResultOverridden, true);
    equal(lResultForFs, false);
  });

  it("should override default built-ins with custom built-ins if both are provided", () => {
    const lModuleName = "overridden";
    const lResolveOptions = {
      builtInModules: {
        override: [lModuleName],
        add: ["my-module"],
      },
    };

    const lResult = isBuiltin(lModuleName, lResolveOptions);

    equal(lResult, true);
  });
});
