import { readFileSync } from "node:fs";
import { expect } from "chai";
import normalizeSource from "../normalize-source.utl.mjs";
import typescriptWrap from "../../../src/extract/transpile/typescript-wrap.mjs";

const typeScriptRegularWrap = typescriptWrap();
const typeScriptTsxWrap = typescriptWrap("tsx");
const typeScriptESMWrap = typescriptWrap("esm");

describe("[I] typescript transpiler", () => {
  it("tells the typescript transpiler is available", () => {
    expect(typeScriptRegularWrap.isAvailable()).to.equal(true);
  });

  it("transpiles typescript", () => {
    expect(
      normalizeSource(
        typeScriptRegularWrap.transpile(
          readFileSync(
            "./test/extract/transpile/__mocks__/typescriptscript.ts",
            "utf8"
          )
        )
      )
    ).to.equal(
      normalizeSource(
        readFileSync(
          "./test/extract/transpile/__fixtures__/typescriptscript.js",
          "utf8"
        )
      )
    );
  });
});

describe("[I] typescript transpiler (tsx)", () => {
  it("tells the tsx transpiler is available", () => {
    expect(typeScriptTsxWrap.isAvailable()).to.equal(true);
  });

  it("transpiles tsx", () => {
    expect(
      normalizeSource(
        typeScriptTsxWrap.transpile(
          readFileSync("./test/extract/transpile/__mocks__/tsx.tsx", "utf8")
        )
      )
    ).to.equal(
      normalizeSource(
        readFileSync("./test/extract/transpile/__fixtures__/tsx.js", "utf8")
      )
    );
  });
});

describe("[I] typescript transpiler (esm)", () => {
  it("tells the ts transpiler is available for mts (esm) modules", () => {
    expect(typeScriptESMWrap.isAvailable()).to.equal(true);
  });

  it("transpiles mts", () => {
    expect(
      normalizeSource(
        typeScriptESMWrap.transpile(
          readFileSync("./test/extract/transpile/__mocks__/mts.mts", "utf8")
        )
      )
    ).to.equal(
      normalizeSource(
        readFileSync("./test/extract/transpile/__fixtures__/mts.mjs", "utf8")
      )
    );
  });
});
