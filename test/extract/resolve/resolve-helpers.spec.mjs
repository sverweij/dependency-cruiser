import { expect } from "chai";
import resolveHelpers from "../../../src/extract/resolve/resolve-helpers.js";

describe("[U] extract/resolve/resolveHelpers - stripToModuleName", () => {
  it("yields the empty string when stripping the empty string", () => {
    expect(resolveHelpers.stripToModuleName("")).to.equal("");
  });
  it("leaves imports without inline loaders alone", () => {
    expect(resolveHelpers.stripToModuleName("some_module")).to.equal(
      "some_module"
    );
    expect(resolveHelpers.stripToModuleName("./local/module")).to.equal(
      "./local/module"
    );
    expect(resolveHelpers.stripToModuleName("@some/module")).to.equal(
      "@some/module"
    );
    expect(resolveHelpers.stripToModuleName("/abso/lute/path")).to.equal(
      "/abso/lute/path"
    );
  });
  it("takes the name after the last ! when there's inline loaders involved", () => {
    expect(resolveHelpers.stripToModuleName("!some_module")).to.equal(
      "some_module"
    );
    expect(resolveHelpers.stripToModuleName("hello!./local/module")).to.equal(
      "./local/module"
    );
    expect(
      resolveHelpers.stripToModuleName("wim!zus!jet!@some/module")
    ).to.equal("@some/module");
    expect(
      resolveHelpers.stripToModuleName("!!taa!tuu!taa!tuu!!!./thing.js")
    ).to.equal("./thing.js");
    expect(resolveHelpers.stripToModuleName("edge-case!!")).to.equal("");
  });
});
