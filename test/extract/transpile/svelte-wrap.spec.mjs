import { promises as fsPromise } from "fs";
import { expect } from "chai";
import svelteWrap from "../../../src/extract/transpile/svelte-wrap.js";
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
          'import Header from "./Header.svelte";'
        ),
    ],
  ].forEach(([variant, transformExpected]) => {
    it(`'transpiles' svelte with "<script lang='${variant}'>"'`, async () => {
      const observedPromise = fsPromise
        .readFile(
          `./test/extract/transpile/__mocks__/svelte-${variant}.svelte`,
          "utf8"
        )
        .then((pSourceCode) => wrap.transpile(pSourceCode));
      const expectedPromise = fsPromise.readFile(
        "./test/extract/transpile/__fixtures__/svelte.js",
        "utf8"
      );

      const [observed, expected] = await Promise.all([
        observedPromise,
        expectedPromise,
      ]);
      expect(normalizeSource(observed)).to.equal(
        normalizeSource(transformExpected(expected))
      );
    });
  });
});
