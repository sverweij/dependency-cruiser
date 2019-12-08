const expect = require("chai").expect;
const dependencyIsEqual = require("../../../src/extract/utl/dependencyIsEqual");

describe("extract/utl/dependencyIsEqual", () => {
  it("two empty dependencies are equal", () => {
    expect(dependencyIsEqual({})({})).to.equal(true);
  });

  it("same module name, same module system => equal", () => {
    expect(
      dependencyIsEqual({ module: "foo", moduleSystem: "es6" })({
        module: "foo",
        moduleSystem: "es6"
      })
    ).to.equal(true);
  });

  it("same module name, same module system, dynamicmoduleness, exotic require => equal", () => {
    expect(
      dependencyIsEqual({
        module: "foo",
        moduleSystem: "cjs",
        dynamic: false,
        exoticRequire: "need"
      })({
        module: "foo",
        moduleSystem: "cjs",
        dynamic: false,
        exoticRequire: "need"
      })
    ).to.equal(true);
  });

  it("same module name, different module system => neq", () => {
    expect(
      dependencyIsEqual({
        module: "foo",
        moduleSystem: "es6"
      })({
        module: "foo",
        moduleSystem: "cjs"
      })
    ).to.equal(false);
  });

  it("different module name, same module system => neq", () => {
    expect(
      dependencyIsEqual({
        module: "foo",
        moduleSystem: "es6"
      })({
        module: "bar",
        moduleSystem: "es6"
      })
    ).to.equal(false);
  });

  it("same module name, same module system, not dynamically required => neq", () => {
    expect(
      dependencyIsEqual({
        module: "foo",
        moduleSystem: "es6",
        dynamic: true
      })({
        module: "foo",
        moduleSystem: "es6"
      })
    ).to.equal(false);
  });

  it("same module name, same module system, not different exotic require => neq", () => {
    expect(
      dependencyIsEqual({
        module: "foo",
        moduleSystem: "es6",
        exoticRequire: "need"
      })({
        module: "foo",
        moduleSystem: "es6"
      })
    ).to.equal(false);
  });
});
