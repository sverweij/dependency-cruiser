const expect = require("chai").expect;
const compare = require("~/src/extract/utl/compare");

describe("extract/utl/compare - dependencyEquals", () => {
  it("two empty dependencies are equal", () => {
    expect(compare.dependenciesEqual({})({})).to.equal(true);
  });

  it("same module name, same module system => equal", () => {
    expect(
      compare.dependenciesEqual({ module: "foo", moduleSystem: "es6" })({
        module: "foo",
        moduleSystem: "es6",
      })
    ).to.equal(true);
  });

  it("same module name, same module system, dynamicmoduleness, exotic require => equal", () => {
    expect(
      compare.dependenciesEqual({
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
      compare.dependenciesEqual({
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
      compare.dependenciesEqual({
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
      compare.dependenciesEqual({
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
      compare.dependenciesEqual({
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
