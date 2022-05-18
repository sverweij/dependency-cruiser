import fs from "node:fs";
import { expect } from "chai";
import normalizeSource from "../normalize-source.utl.mjs";
import typescriptWrap from "../../../src/extract/transpile/typescript-wrap.js";

const wrap = typescriptWrap();
const tsxWrap = typescriptWrap(true);

describe("[I] typescript transpiler", () => {
  it("tells the typescript transpiler is available", () => {
    expect(wrap.isAvailable()).to.equal(true);
  });

  it("transpiles typescript", () => {
    expect(
      normalizeSource(
        wrap.transpile(
          fs.readFileSync(
            "./test/extract/transpile/__mocks__/typescriptscript.ts",
            "utf8"
          )
        )
      )
    ).to.equal(
      normalizeSource(
        fs.readFileSync(
          "./test/extract/transpile/__fixtures__/typescriptscript.js",
          "utf8"
        )
      )
    );
  });
});

describe("[I] tsx transpiler (plain old typescript)", () => {
  it("tells the tsx transpiler is available", () => {
    expect(tsxWrap.isAvailable()).to.equal(true);
  });

  it("transpiles tsx", () => {
    expect(
      normalizeSource(
        tsxWrap.transpile(
          fs.readFileSync("./test/extract/transpile/__mocks__/tsx.tsx", "utf8")
        )
      )
    ).to.equal(
      normalizeSource(
        fs.readFileSync("./test/extract/transpile/__fixtures__/tsx.js", "utf8")
      )
    );
  });
});
