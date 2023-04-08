import { expect } from "chai";
import { isExternalModule } from "../../../src/extract/resolve/module-classifiers.mjs";

describe("[U] extract/resolve/module-classifiers - isExternalModule", () => {
  it("returns false when passed nothing", () => {
    expect(isExternalModule()).to.equal(false);
  });
  it("returns false when passed null", () => {
    expect(isExternalModule(null)).to.equal(false);
  });
  it("returns false when passed an empty string", () => {
    expect(isExternalModule("")).to.equal(false);
  });
  it("returns false when passed a path ", () => {
    expect(isExternalModule("a-path")).to.equal(false);
  });
  it("returns false when passed a path that doesn't include one of the passed external module folders", () => {
    expect(isExternalModule("a-path", ["node_modules"])).to.equal(false);
  });
  it("returns true when passed a path that includes the one passed external module folder", () => {
    expect(
      isExternalModule("node_modules/a-path-to/index.js", ["node_modules"])
    ).to.equal(true);
  });
  it("returns true when passed a path that includes one of the passed external module folders", () => {
    expect(
      isExternalModule("shwok/a-path-to/index.js", [
        "node_modules",
        "node_modules/@types",
        "shwok",
      ])
    ).to.equal(true);
  });
});
