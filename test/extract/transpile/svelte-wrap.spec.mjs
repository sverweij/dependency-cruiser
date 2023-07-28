import { strictEqual } from "node:assert";
import { readFileSync } from "node:fs";
import { expect } from "chai";
import svelteWrap from "../../../src/extract/transpile/svelte-wrap.mjs";
import normalizeSource from "../normalize-source.utl.mjs";
import typescriptWrap from "../../../src/extract/transpile/typescript-wrap.mjs";

const wrap = svelteWrap(typescriptWrap(true));

describe("[I] svelte transpiler", () => {
  it("tells the svelte transpiler is available", () => {
    expect(wrap.isAvailable()).to.equal(true);
  });
  [
    ["ts", (pSource) => pSource],
    [
      "js",
      (pSource) =>
        pSource.replace(
          'import "./Header.svelte";',
          'import Header from "./Header.svelte";',
        ),
    ],
  ].forEach(([variant, transformExpected]) => {
    it(`'transpiles' svelte with "<script lang='${variant}'>"'`, async () => {
      const lSource = readFileSync(
        `./test/extract/transpile/__mocks__/svelte-${variant}.svelte`,
        "utf8",
      );
      const lObserved = await normalizeSource(wrap.transpile(lSource));
      const lExpected = await normalizeSource(
        transformExpected(
          readFileSync(
            "./test/extract/transpile/__fixtures__/svelte.js",
            "utf8",
          ),
        ),
      );

      strictEqual(lObserved, lExpected);
    });
  });
});
