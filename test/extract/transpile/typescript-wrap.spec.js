const fs = require("fs");
const { expect } = require("chai");
const normalizeSource = require("../normalize-source.utl");
const wrap = require("../../../src/extract/transpile/typescript-wrap")();
const tsxWrap = require("../../../src/extract/transpile/typescript-wrap")(true);

describe("typescript transpiler", () => {
  it("tells the typescript transpiler is available", () => {
    expect(wrap.isAvailable()).to.equal(true);
  });

  it("transpiles typescript", () => {
    expect(
      normalizeSource(
        wrap.transpile(
          fs.readFileSync(
            "./test/extract/transpile/fixtures/typescriptscript.ts",
            "utf8"
          )
        )
      )
    ).to.equal(
      normalizeSource(
        fs.readFileSync(
          "./test/extract/transpile/fixtures/typescriptscript.js",
          "utf8"
        )
      )
    );
  });
});

describe("tsx transpiler (plain old typescript)", () => {
  it("tells the tsx transpiler is available", () => {
    expect(tsxWrap.isAvailable()).to.equal(true);
  });

  it("transpiles tsx", () => {
    expect(
      normalizeSource(
        tsxWrap.transpile(
          fs.readFileSync("./test/extract/transpile/fixtures/tsx.tsx", "utf8")
        )
      )
    ).to.equal(
      normalizeSource(
        fs.readFileSync("./test/extract/transpile/fixtures/tsx.js", "utf8")
      )
    );
  });
});
