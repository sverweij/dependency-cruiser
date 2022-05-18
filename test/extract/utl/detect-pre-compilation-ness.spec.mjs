import { expect } from "chai";
import detectPrecompilationNess from "../../../src/extract/utl/detect-pre-compilation-ness.js";

describe("[U] extract/utl/detectPreCompilationNess", () => {
  it("empty dependency lists yield an empty one", () => {
    expect(detectPrecompilationNess([], [])).to.deep.equal([]);
  });

  it("deps in the first not in the second get the isPreCompilationOnly attribute", () => {
    expect(
      detectPrecompilationNess([{ module: "foo", moduleSystem: "es6" }], [])
    ).to.deep.equal([
      { module: "foo", moduleSystem: "es6", preCompilationOnly: true },
    ]);
  });

  it("deps in the first and in the second get the isPreCompilationOnly attribute with value false", () => {
    expect(
      detectPrecompilationNess(
        [{ module: "foo", moduleSystem: "es6" }],
        [{ module: "foo", moduleSystem: "es6" }]
      )
    ).to.deep.equal([
      { module: "foo", moduleSystem: "es6", preCompilationOnly: false },
    ]);
  });

  it("deps in the first but not in the second (moduleSystem mismatch only) get the isPreCompilationOnly attribute with value true", () => {
    expect(
      detectPrecompilationNess(
        [{ module: "foo", moduleSystem: "es6" }],
        [{ module: "foo", moduleSystem: "cjs" }]
      )
    ).to.deep.equal([
      { module: "foo", moduleSystem: "es6", preCompilationOnly: false },
    ]);
  });

  it("deps only in the second list vanish", () => {
    expect(
      detectPrecompilationNess([], [{ module: "foo", moduleSystem: "es6" }])
    ).to.deep.equal([]);
  });
});
