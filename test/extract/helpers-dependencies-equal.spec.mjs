import { expect } from "chai";
import { dependenciesEqual } from "../../src/extract/helpers.mjs";

describe("[U] extract/helpers - dependencyEqual", () => {
  it("two empty dependencies are equal", () => {
    expect(dependenciesEqual({})({})).to.equal(true);
  });

  it("same module name, same module system => equal", () => {
    expect(
      dependenciesEqual({ module: "foo", moduleSystem: "es6" })({
        module: "foo",
        moduleSystem: "es6",
      })
    ).to.equal(true);
  });

  it("same module name, same module system, dynamicmoduleness, exotic require => equal", () => {
    expect(
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
      })
    ).to.equal(true);
  });

  it("same module name, different module system => eq", () => {
    expect(
      dependenciesEqual({
        module: "foo",
        moduleSystem: "es6",
      })({
        module: "foo",
        moduleSystem: "cjs",
      })
    ).to.equal(true);
  });

  it("different module name, same module system => neq", () => {
    expect(
      dependenciesEqual({
        module: "foo",
        moduleSystem: "es6",
      })({
        module: "bar",
        moduleSystem: "es6",
      })
    ).to.equal(false);
  });

  it("same module name, same module system, not dynamically required => neq", () => {
    expect(
      dependenciesEqual({
        module: "foo",
        moduleSystem: "es6",
        dynamic: true,
      })({
        module: "foo",
        moduleSystem: "es6",
      })
    ).to.equal(false);
  });

  it("same module name, same module system, not different exotic require => neq", () => {
    expect(
      dependenciesEqual({
        module: "foo",
        moduleSystem: "es6",
        exoticRequire: "need",
      })({
        module: "foo",
        moduleSystem: "es6",
      })
    ).to.equal(false);
  });
});
