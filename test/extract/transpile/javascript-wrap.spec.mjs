import { equal } from "node:assert/strict";
import { readFileSync } from "node:fs";
import wrap from "#extract/transpile/javascript-wrap.mjs";

describe("[I] javascript transpiler", () => {
  it("tells the jsx transpiler is available", () => {
    equal(wrap.isAvailable(), true);
  });

  it("'transpiles' jsx", () => {
    equal(
      wrap.transpile(
        readFileSync("./test/extract/transpile/__mocks__/jsx.jsx", "utf8"),
      ),

      readFileSync("./test/extract/transpile/__fixtures__/jsx.js", "utf8"),
    );
  });

  it("transpiles mjs", () => {
    equal(
      wrap.transpile(
        readFileSync("./test/extract/transpile/__mocks__/mjs.mjs", "utf8"),
      ),

      readFileSync("./test/extract/transpile/__fixtures__/mjs.js", "utf8"),
    );
  });
});
