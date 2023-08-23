import { equal } from "node:assert/strict";
import wrap from "../../../src/extract/transpile/livescript-wrap.mjs";

describe("[I] livescript transpiler", () => {
  it("tells the livescript transpiler is not available", () => {
    equal(wrap.isAvailable(), false);
  });
});
