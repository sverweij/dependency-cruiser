import { throws, strictEqual } from "node:assert";
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
    strictEqual(isRelativeModuleName(""), false);
  });

  it("returns false when passed an external module", () => {
    strictEqual(isRelativeModuleName("externaldash"), false);
  });

  it("returns false when passed an external module name that starts with a dot", () => {
    strictEqual(isRelativeModuleName(".external-starts-with-a-dot"), false);
  });

  it("returns true when passed a local module in the same folder", () => {
    strictEqual(isRelativeModuleName("./path"), true);
  });

  it("returns true when passed a local module in a sub folder", () => {
    strictEqual(isRelativeModuleName("../../halikidee"), true);
  });

  it("returns true when passed the current folder", () => {
    strictEqual(isRelativeModuleName("."), true);
  });

  it("returns true when passed the parent folder", () => {
    strictEqual(isRelativeModuleName(".."), true);
  });
});
