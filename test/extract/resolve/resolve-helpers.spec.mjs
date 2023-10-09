import { equal } from "node:assert/strict";
import { stripToModuleName } from "#extract/resolve/resolve-helpers.mjs";

describe("[U] extract/resolve/resolveHelpers - stripToModuleName", () => {
  it("yields the empty string when stripping the empty string", () => {
    equal(stripToModuleName(""), "");
  });
  it("leaves imports without inline loaders alone", () => {
    equal(stripToModuleName("some_module"), "some_module");
    equal(stripToModuleName("./local/module"), "./local/module");
    equal(stripToModuleName("@some/module"), "@some/module");
    equal(stripToModuleName("/abso/lute/path"), "/abso/lute/path");
  });
  it("takes the name after the last ! when there's inline loaders involved", () => {
    equal(stripToModuleName("!some_module"), "some_module");
    equal(stripToModuleName("hello!./local/module"), "./local/module");
    equal(stripToModuleName("wim!zus!jet!@some/module"), "@some/module");
    equal(stripToModuleName("!!taa!tuu!taa!tuu!!!./thing.js"), "./thing.js");
    equal(stripToModuleName("edge-case!!"), "");
  });
});
