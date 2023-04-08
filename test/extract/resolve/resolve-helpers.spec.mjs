import { expect } from "chai";
import { stripToModuleName } from "../../../src/extract/resolve/resolve-helpers.mjs";

describe("[U] extract/resolve/resolveHelpers - stripToModuleName", () => {
  it("yields the empty string when stripping the empty string", () => {
    expect(stripToModuleName("")).to.equal("");
  });
  it("leaves imports without inline loaders alone", () => {
    expect(stripToModuleName("some_module")).to.equal("some_module");
    expect(stripToModuleName("./local/module")).to.equal("./local/module");
    expect(stripToModuleName("@some/module")).to.equal("@some/module");
    expect(stripToModuleName("/abso/lute/path")).to.equal("/abso/lute/path");
  });
  it("takes the name after the last ! when there's inline loaders involved", () => {
    expect(stripToModuleName("!some_module")).to.equal("some_module");
    expect(stripToModuleName("hello!./local/module")).to.equal(
      "./local/module"
    );
    expect(stripToModuleName("wim!zus!jet!@some/module")).to.equal(
      "@some/module"
    );
    expect(stripToModuleName("!!taa!tuu!taa!tuu!!!./thing.js")).to.equal(
      "./thing.js"
    );
    expect(stripToModuleName("edge-case!!")).to.equal("");
  });
});
