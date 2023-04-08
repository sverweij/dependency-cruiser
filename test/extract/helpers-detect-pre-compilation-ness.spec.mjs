import { expect } from "chai";
import { detectPreCompilationNess } from "../../src/extract/helpers.mjs";

describe("[U] extract/helpers - detectPreCompilationNess", () => {
  it("empty dependency lists yield an empty one", () => {
    expect(detectPreCompilationNess([], [])).to.deep.equal([]);
  });

  it("deps in the first not in the second get the isPreCompilationOnly attribute", () => {
    expect(
      detectPreCompilationNess([{ module: "foo", moduleSystem: "es6" }], [])
    ).to.deep.equal([
      { module: "foo", moduleSystem: "es6", preCompilationOnly: true },
    ]);
  });

  it("deps in the first and in the second get the isPreCompilationOnly attribute with value false", () => {
    expect(
      detectPreCompilationNess(
        [{ module: "foo", moduleSystem: "es6" }],
        [{ module: "foo", moduleSystem: "es6" }]
      )
    ).to.deep.equal([
      { module: "foo", moduleSystem: "es6", preCompilationOnly: false },
    ]);
  });

  it("deps in the first but not in the second (moduleSystem mismatch only) get the isPreCompilationOnly attribute with value true", () => {
    expect(
      detectPreCompilationNess(
        [{ module: "foo", moduleSystem: "es6" }],
        [{ module: "foo", moduleSystem: "cjs" }]
      )
    ).to.deep.equal([
      { module: "foo", moduleSystem: "es6", preCompilationOnly: false },
    ]);
  });

  it("deps only in the second list vanish", () => {
    expect(
      detectPreCompilationNess([], [{ module: "foo", moduleSystem: "es6" }])
    ).to.deep.equal([]);
  });
});
