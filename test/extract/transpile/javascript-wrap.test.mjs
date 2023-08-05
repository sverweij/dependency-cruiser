import { strictEqual } from "node:assert";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import wrap from "../../../src/extract/transpile/javascript-wrap.mjs";

describe("[I] javascript transpiler", () => {
  it("tells the jsx transpiler is available", () => {
    strictEqual(wrap.isAvailable(), true);
  });

  it("'transpiles' jsx", () => {
    strictEqual(
      wrap.transpile(
        readFileSync("./test/extract/transpile/__mocks__/jsx.jsx", "utf8")
      ),

      readFileSync("./test/extract/transpile/__fixtures__/jsx.js", "utf8")
    );
  });

  it("transpiles mjs", () => {
    strictEqual(
      wrap.transpile(
        readFileSync("./test/extract/transpile/__mocks__/mjs.mjs", "utf8")
      ),

      readFileSync("./test/extract/transpile/__fixtures__/mjs.js", "utf8")
    );
  });
});
