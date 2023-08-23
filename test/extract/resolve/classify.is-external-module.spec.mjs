import { equal } from "node:assert/strict";
import { isExternalModule } from "../../../src/extract/resolve/module-classifiers.mjs";

describe("[U] extract/resolve/module-classifiers - isExternalModule", () => {
  it("returns false when passed nothing", () => {
    equal(isExternalModule(), false);
  });
  it("returns false when passed null", () => {
    equal(isExternalModule(null), false);
  });
  it("returns false when passed an empty string", () => {
    equal(isExternalModule(""), false);
  });
  it("returns false when passed a path ", () => {
    equal(isExternalModule("a-path"), false);
  });
  it("returns false when passed a path that doesn't include one of the passed external module folders", () => {
    equal(isExternalModule("a-path", ["node_modules"]), false);
  });
  it("returns true when passed a path that includes the one passed external module folder", () => {
    equal(
      isExternalModule("node_modules/a-path-to/index.js", ["node_modules"]),
      true,
    );
  });
  it("returns true when passed a path that includes one of the passed external module folders", () => {
    equal(
      isExternalModule("shwok/a-path-to/index.js", [
        "node_modules",
        "node_modules/@types",
        "shwok",
      ]),
      true,
    );
  });
});
