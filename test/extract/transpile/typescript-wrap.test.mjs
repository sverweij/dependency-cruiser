import { strictEqual } from "node:assert";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import normalizeSource from "../normalize-source.utl.mjs";
import typescriptWrap from "../../../src/extract/transpile/typescript-wrap.mjs";

const typeScriptRegularWrap = typescriptWrap();
const typeScriptTsxWrap = typescriptWrap("tsx");
const typeScriptESMWrap = typescriptWrap("esm");

describe("[I] typescript transpiler", () => {
  it("tells the typescript transpiler is available", () => {
    strictEqual(typeScriptRegularWrap.isAvailable(), true);
  });

  it("transpiles typescript", async () => {
    const lExpected = await normalizeSource(
      typeScriptRegularWrap.transpile(
        readFileSync(
          "./test/extract/transpile/__mocks__/typescriptscript.ts",
          "utf8"
        )
      )
    );
    const lFound = await normalizeSource(
      readFileSync(
        "./test/extract/transpile/__fixtures__/typescriptscript.js",
        "utf8"
      )
    );
    strictEqual(lExpected, lFound);
  });
});

describe("[I] typescript transpiler (tsx)", () => {
  it("tells the tsx transpiler is available", () => {
    strictEqual(typeScriptTsxWrap.isAvailable(), true);
  });

  it("transpiles tsx", async () => {
    const lExpected = await normalizeSource(
      typeScriptTsxWrap.transpile(
        readFileSync("./test/extract/transpile/__mocks__/tsx.tsx", "utf8")
      )
    );
    const lFound = await normalizeSource(
      readFileSync("./test/extract/transpile/__fixtures__/tsx.js", "utf8")
    );
    strictEqual(lExpected, lFound);
  });
});

describe("[I] typescript transpiler (esm)", () => {
  it("tells the ts transpiler is available for mts (esm) modules", () => {
    strictEqual(typeScriptESMWrap.isAvailable(), true);
  });

  it("transpiles mts", async () => {
    const lExpected = await normalizeSource(
      typeScriptESMWrap.transpile(
        readFileSync("./test/extract/transpile/__mocks__/mts.mts", "utf8")
      )
    );
    const lFound = await normalizeSource(
      readFileSync("./test/extract/transpile/__fixtures__/mts.mjs", "utf8")
    );
    strictEqual(lExpected, lFound);
  });
});
