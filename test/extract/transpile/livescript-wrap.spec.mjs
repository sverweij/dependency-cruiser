import { strictEqual } from "node:assert";
import wrap from "../../../src/extract/transpile/livescript-wrap.mjs";

describe("[I] livescript transpiler", () => {
  it("tells the livescript transpiler is not available", () => {
    strictEqual(wrap.isAvailable(), false);
  });
});
