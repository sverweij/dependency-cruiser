import { expect } from "chai";
import tryImportAvailable from "../../../src/extract/transpile/try-import-available.mjs";

describe("[U] extract/transpile/try-import-available", () => {
  it("returns true when the module can be resolved", () => {
    expect(tryImportAvailable("acorn")).to.equal(true);
  });
  it("returns true when the module can be resolved & its version range matches", () => {
    expect(tryImportAvailable("acorn", "^8")).to.equal(true);
  });
  it("returns false when the module can be resolved & its version range does not match", () => {
    expect(tryImportAvailable("acorn", "<8")).to.equal(false);
  });
  it("returns false when the module cannot be resolved", () => {
    expect(tryImportAvailable("not-an-existing-module")).to.equal(false);
  });
  it("returns false when the module cannot be resolved (with version range)", () => {
    expect(tryImportAvailable("not-an-existing-module", ">0")).to.equal(false);
  });
  it("does not bork when confronted with a local import (resolvable)", () => {
    expect(tryImportAvailable("./try-import-available.mjs")).to.equal(true);
  });
  it("does not bork when confronted with a local import (resolvable, with a version number)", () => {
    // weirdo country
    expect(tryImportAvailable("./try-import-available.mjs", ">=0")).to.equal(
      false
    );
  });
});
