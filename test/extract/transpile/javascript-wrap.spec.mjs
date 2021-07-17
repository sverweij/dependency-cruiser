import { readFileSync } from "node:fs";
import { expect } from "chai";
import wrap from "../../../src/extract/transpile/javascript-wrap.js";

describe("jsx transpiler (the plain old javascript one)", () => {
  it("tells the jsx transpiler is available", () => {
    expect(wrap.isAvailable()).to.equal(true);
  });

  it("'transpiles' jsx", () => {
    expect(
      wrap.transpile(
        readFileSync("./test/extract/transpile/fixtures/jsx.jsx", "utf8")
      )
    ).to.equal(
      readFileSync("./test/extract/transpile/fixtures/jsx.js", "utf8")
    );
  });

  it("transpiles mjs", () => {
    expect(
      wrap.transpile(
        readFileSync("./test/extract/transpile/fixtures/mjs.mjs", "utf8")
      )
    ).to.equal(
      readFileSync("./test/extract/transpile/fixtures/mjs.js", "utf8")
    );
  });
});
