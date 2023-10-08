import { equal } from "node:assert/strict";
import tryImportAvailable from "#extract/transpile/try-import-available.mjs";

describe("[U] extract/transpile/try-import-available", () => {
  it("returns true when the module can be resolved", () => {
    equal(tryImportAvailable("acorn"), true);
  });
  it("returns true when the module can be resolved & its version range matches", () => {
    equal(tryImportAvailable("acorn", "^8"), true);
  });
  it("returns false when the module can be resolved & its version range does not match", () => {
    equal(tryImportAvailable("acorn", "<8"), false);
  });
  it("returns false when the module cannot be resolved", () => {
    equal(tryImportAvailable("not-an-existing-module"), false);
  });
  it("returns false when the module cannot be resolved (with version range)", () => {
    equal(tryImportAvailable("not-an-existing-module", ">0"), false);
  });
  it("does not bork when confronted with a local import (resolvable)", () => {
    equal(tryImportAvailable("./try-import-available.mjs"), true);
  });
  it("does not bork when confronted with a local import (resolvable, with a version number)", () => {
    // weirdo country
    equal(tryImportAvailable("./try-import-available.mjs", ">=0"), false);
  });
});
