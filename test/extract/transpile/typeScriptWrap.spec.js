const fs = require("fs");
const expect = require("chai").expect;
const normalizeNewline = require("normalize-newline");
const wrap = require("../../../src/extract/transpile/typeScriptWrap")();
const tsxWrap = require("../../../src/extract/transpile/typeScriptWrap")(true);

describe("typescript transpiler", () => {
  it("tells the typescript transpiler is available", () => {
    expect(wrap.isAvailable()).to.equal(true);
  });

  it("transpiles typescript", () => {
    expect(
      normalizeNewline(
        wrap.transpile(
          fs.readFileSync(
            "./test/extract/transpile/fixtures/typescriptscript.ts",
            "utf8"
          )
        )
      )
    ).to.equal(
      fs.readFileSync(
        "./test/extract/transpile/fixtures/typescriptscript.js",
        "utf8"
      )
    );
  });
});

describe("tsx transpiler (plain old typescript)", () => {
  it("tells the jsx transpiler is available", () => {
    expect(tsxWrap.isAvailable()).to.equal(true);
  });

  it("transpiles tsx", () => {
    expect(
      normalizeNewline(
        tsxWrap.transpile(
          fs.readFileSync("./test/extract/transpile/fixtures/tsx.tsx", "utf8")
        )
      )
    ).to.equal(
      fs.readFileSync("./test/extract/transpile/fixtures/tsx.js", "utf8")
    );
  });
});
