const fs = require("fs");
const path = require("path");
const { expect } = require("chai");
const prettier = require("prettier");
const normalizeNewline = require("normalize-newline");
const transpile = require("../../../src/extract/transpile");

describe("transpiler", () => {
  it("As the 'livescript' transpiler is not available, returns the original source", () => {
    expect(transpile(".ls", "whatever the bever")).to.equal(
      "whatever the bever"
    );
  });

  it("Returns svelte compiled down to js", () => {
    const lInput = normalizeNewline(
      fs.readFileSync(
        path.join(__dirname, "fixtures", "svelte-ts.svelte"),
        "utf8"
      )
    );
    const lExpectedOoutput = normalizeNewline(
      fs.readFileSync(path.join(__dirname, "fixtures", "svelte.js"), "utf8")
    );

    expect(transpile(".svelte", lInput)).to.equal(lExpectedOoutput);
  });

  it("Does not confuse .ts for .tsx", () => {
    const lInputFixture = fs.readFileSync(
      path.join(
        __dirname,
        "fixtures/dontconfuse_ts_for_tsx/input/Observable.ts"
      ),
      "utf8"
    );
    const lTranspiledFixture = fs.readFileSync(
      path.join(
        __dirname,
        "fixtures/dontconfuse_ts_for_tsx/transpiled/Observable.js"
      ),
      "utf8"
    );

    expect(
      normalizeNewline(
        prettier.format(transpile(".ts", lInputFixture), { parser: "babel" })
      )
    ).to.equal(
      normalizeNewline(prettier.format(lTranspiledFixture, { parser: "babel" }))
    );
  });

  it("Takes a tsconfig and takes that into account on transpilation", () => {
    const lInputFixture = fs.readFileSync(
      path.join(
        __dirname,
        "fixtures/dontconfuse_ts_for_tsx/input/Observable.ts"
      ),
      "utf8"
    );
    const lTranspiledFixture = fs.readFileSync(
      path.join(
        __dirname,
        "fixtures/dontconfuse_ts_for_tsx/transpiled/Observable.js"
      ),
      "utf8"
    );

    const lTranspilerOptions = {
      baseUrl: "src",
      paths: {
        "@core/*": ["core/*"],
      },
      rootDirs: ["shared", "hello"],
      typeRoots: ["../../types"],
      types: ["foo", "bar", "baz"],
    };
    expect(
      normalizeNewline(
        prettier.format(transpile(".ts", lInputFixture, lTranspilerOptions), {
          parser: "babel",
        })
      )
    ).to.equal(
      normalizeNewline(
        prettier.format(lTranspiledFixture, {
          parser: "babel",
        })
      )
    );
  });
});
