import { strictEqual } from "node:assert";
import tryImportAvailable from "../../../src/extract/transpile/try-import-available.mjs";

describe("[U] extract/transpile/try-import-available", () => {
  it("returns true when the module can be resolved", () => {
    strictEqual(tryImportAvailable("acorn"), true);
  });
  it("returns true when the module can be resolved & its version range matches", () => {
    strictEqual(tryImportAvailable("acorn", "^8"), true);
  });
  it("returns false when the module can be resolved & its version range does not match", () => {
    strictEqual(tryImportAvailable("acorn", "<8"), false);
  });
  it("returns false when the module cannot be resolved", () => {
    strictEqual(tryImportAvailable("not-an-existing-module"), false);
  });
  it("returns false when the module cannot be resolved (with version range)", () => {
    strictEqual(tryImportAvailable("not-an-existing-module", ">0"), false);
  });
  it("does not bork when confronted with a local import (resolvable)", () => {
    strictEqual(tryImportAvailable("./try-import-available.mjs"), true);
  });
  it("does not bork when confronted with a local import (resolvable, with a version number)", () => {
    // weirdo country
    strictEqual(tryImportAvailable("./try-import-available.mjs", ">=0"), false);
  });
});
