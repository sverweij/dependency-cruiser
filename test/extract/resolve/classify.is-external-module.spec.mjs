import { strictEqual } from "node:assert";
import { isExternalModule } from "../../../src/extract/resolve/module-classifiers.mjs";

describe("[U] extract/resolve/module-classifiers - isExternalModule", () => {
  it("returns false when passed nothing", () => {
    strictEqual(isExternalModule(), false);
  });
  it("returns false when passed null", () => {
    strictEqual(isExternalModule(null), false);
  });
  it("returns false when passed an empty string", () => {
    strictEqual(isExternalModule(""), false);
  });
  it("returns false when passed a path ", () => {
    strictEqual(isExternalModule("a-path"), false);
  });
  it("returns false when passed a path that doesn't include one of the passed external module folders", () => {
    strictEqual(isExternalModule("a-path", ["node_modules"]), false);
  });
  it("returns true when passed a path that includes the one passed external module folder", () => {
    strictEqual(
      isExternalModule("node_modules/a-path-to/index.js", ["node_modules"]),
      true,
    );
  });
  it("returns true when passed a path that includes one of the passed external module folders", () => {
    strictEqual(
      isExternalModule("shwok/a-path-to/index.js", [
        "node_modules",
        "node_modules/@types",
        "shwok",
      ]),
      true,
    );
  });
});
