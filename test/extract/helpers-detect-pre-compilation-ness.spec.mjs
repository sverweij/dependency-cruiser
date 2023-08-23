import { deepEqual } from "node:assert/strict";
import { detectPreCompilationNess } from "../../src/extract/helpers.mjs";

describe("[U] extract/helpers - detectPreCompilationNess", () => {
  it("empty dependency lists yield an empty one", () => {
    deepEqual(detectPreCompilationNess([], []), []);
  });

  it("deps in the first not in the second get the isPreCompilationOnly attribute", () => {
    deepEqual(
      detectPreCompilationNess([{ module: "foo", moduleSystem: "es6" }], []),
      [{ module: "foo", moduleSystem: "es6", preCompilationOnly: true }],
    );
  });

  it("deps in the first and in the second get the isPreCompilationOnly attribute with value false", () => {
    deepEqual(
      detectPreCompilationNess(
        [{ module: "foo", moduleSystem: "es6" }],
        [{ module: "foo", moduleSystem: "es6" }],
      ),
      [{ module: "foo", moduleSystem: "es6", preCompilationOnly: false }],
    );
  });

  it("deps in the first but not in the second (moduleSystem mismatch only) get the isPreCompilationOnly attribute with value true", () => {
    deepEqual(
      detectPreCompilationNess(
        [{ module: "foo", moduleSystem: "es6" }],
        [{ module: "foo", moduleSystem: "cjs" }],
      ),
      [{ module: "foo", moduleSystem: "es6", preCompilationOnly: false }],
    );
  });

  it("deps only in the second list vanish", () => {
    deepEqual(
      detectPreCompilationNess([], [{ module: "foo", moduleSystem: "es6" }]),
      [],
    );
  });
});
