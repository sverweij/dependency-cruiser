import { throws, equal } from "node:assert/strict";
import { isRelativeModuleName } from "../../../src/extract/resolve/module-classifiers.mjs";

describe("[U] extract/resolve/module-classifiers - isRelativeModuleName", () => {
  it("throws an error when passed nothing", () => {
    throws(() => {
      isRelativeModuleName();
    });
  });

  it("throws an error when passed null", () => {
    throws(() => {
      isRelativeModuleName(null);
    });
  });

  it("returns false when passed an empty string", () => {
    equal(isRelativeModuleName(""), false);
  });

  it("returns false when passed an external module", () => {
    equal(isRelativeModuleName("externaldash"), false);
  });

  it("returns false when passed an external module name that starts with a dot", () => {
    equal(isRelativeModuleName(".external-starts-with-a-dot"), false);
  });

  it("returns true when passed a local module in the same folder", () => {
    equal(isRelativeModuleName("./path"), true);
  });

  it("returns true when passed a local module in a sub folder", () => {
    equal(isRelativeModuleName("../../halikidee"), true);
  });

  it("returns true when passed the current folder", () => {
    equal(isRelativeModuleName("."), true);
  });

  it("returns true when passed the parent folder", () => {
    equal(isRelativeModuleName(".."), true);
  });
});
