import { strictEqual } from "node:assert";
import { describe, it } from "node:test";
import { stripToModuleName } from "../../../src/extract/resolve/resolve-helpers.mjs";

describe("[U] extract/resolve/resolveHelpers - stripToModuleName", () => {
  it("yields the empty string when stripping the empty string", () => {
    strictEqual(stripToModuleName(""), "");
  });
  it("leaves imports without inline loaders alone", () => {
    strictEqual(stripToModuleName("some_module"), "some_module");
    strictEqual(stripToModuleName("./local/module"), "./local/module");
    strictEqual(stripToModuleName("@some/module"), "@some/module");
    strictEqual(stripToModuleName("/abso/lute/path"), "/abso/lute/path");
  });
  it("takes the name after the last ! when there's inline loaders involved", () => {
    strictEqual(stripToModuleName("!some_module"), "some_module");
    strictEqual(stripToModuleName("hello!./local/module"), "./local/module");
    strictEqual(stripToModuleName("wim!zus!jet!@some/module"), "@some/module");
    strictEqual(
      stripToModuleName("!!taa!tuu!taa!tuu!!!./thing.js"),
      "./thing.js"
    );
    strictEqual(stripToModuleName("edge-case!!"), "");
  });
});
