import { readFileSync } from "node:fs";
import { expect } from "chai";
import wrap from "../../../src/extract/transpile/javascript-wrap.mjs";

describe("[I] javascript transpiler", () => {
  it("tells the jsx transpiler is available", () => {
    expect(wrap.isAvailable()).to.equal(true);
  });

  it("'transpiles' jsx", () => {
    expect(
      wrap.transpile(
        readFileSync("./test/extract/transpile/__mocks__/jsx.jsx", "utf8")
      )
    ).to.equal(
      readFileSync("./test/extract/transpile/__fixtures__/jsx.js", "utf8")
    );
  });

  it("transpiles mjs", () => {
    expect(
      wrap.transpile(
        readFileSync("./test/extract/transpile/__mocks__/mjs.mjs", "utf8")
      )
    ).to.equal(
      readFileSync("./test/extract/transpile/__fixtures__/mjs.js", "utf8")
    );
  });
});
