const { promises: fsPromise } = require("fs");
const { expect } = require("chai");
const wrap = require("../../../src/extract/transpile/svelte-wrap")(
  require("../../../src/extract/transpile/typescript-wrap")(true)
);

describe("svelte transpiler", () => {
  it("tells the svelte transpiler is available", () => {
    expect(wrap.isAvailable()).to.equal(true);
  });

  it("'transpiles' svelte", async () => {
    const observedPromise = fsPromise
      .readFile("./test/extract/transpile/fixtures/svelte.svelte", "utf8")
      .then((pSourceCode) => wrap.transpile(pSourceCode));
    const expectedPromise = fsPromise.readFile(
      "./test/extract/transpile/fixtures/svelte.js",
      "utf8"
    );
    const [observed, expected] = await Promise.all([
      observedPromise,
      expectedPromise,
    ]);
    expect(observed).to.equal(expected);
  });
});
