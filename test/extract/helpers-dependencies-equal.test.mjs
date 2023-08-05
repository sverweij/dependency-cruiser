import { strictEqual } from "node:assert";
import { describe, it } from "node:test";
import { dependenciesEqual } from "../../src/extract/helpers.mjs";

describe("[U] extract/helpers - dependencyEqual", () => {
  it("two empty dependencies are equal", () => {
    strictEqual(dependenciesEqual({})({}), true);
  });

  it("same module name, same module system => equal", () => {
    strictEqual(
      dependenciesEqual({ module: "foo", moduleSystem: "es6" })({
        module: "foo",
        moduleSystem: "es6",
      }),
      true
    );
  });

  it("same module name, same module system, dynamicmoduleness, exotic require => equal", () => {
    strictEqual(
      dependenciesEqual({
        module: "foo",
        moduleSystem: "cjs",
        dynamic: false,
        exoticRequire: "need",
      })({
        module: "foo",
        moduleSystem: "cjs",
        dynamic: false,
        exoticRequire: "need",
      }),
      true
    );
  });

  it("same module name, different module system => eq", () => {
    strictEqual(
      dependenciesEqual({
        module: "foo",
        moduleSystem: "es6",
      })({
        module: "foo",
        moduleSystem: "cjs",
      }),
      true
    );
  });

  it("different module name, same module system => neq", () => {
    strictEqual(
      dependenciesEqual({
        module: "foo",
        moduleSystem: "es6",
      })({
        module: "bar",
        moduleSystem: "es6",
      }),
      false
    );
  });

  it("same module name, same module system, not dynamically required => neq", () => {
    strictEqual(
      dependenciesEqual({
        module: "foo",
        moduleSystem: "es6",
        dynamic: true,
      })({
        module: "foo",
        moduleSystem: "es6",
      }),
      false
    );
  });

  it("same module name, same module system, not different exotic require => neq", () => {
    strictEqual(
      dependenciesEqual({
        module: "foo",
        moduleSystem: "es6",
        exoticRequire: "need",
      })({
        module: "foo",
        moduleSystem: "es6",
      }),
      false
    );
  });
});
