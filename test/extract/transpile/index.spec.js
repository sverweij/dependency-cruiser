const fs = require("fs");
const path = require("path");
const { expect } = require("chai");
const transpile = require("../../../src/extract/transpile");
const normalizeSource = require("../normalize-source.utl");

describe("transpiler", () => {
  it("As the 'livescript' transpiler is not available, returns the original source", () => {
    expect(
      transpile({ extension: ".ls", source: "whatever the bever" })
    ).to.equal("whatever the bever");
  });

  it("As the 'bf-script' transpiler is not supported at all, returns the original source", () => {
    expect(
      transpile({
        extension: ".bfs",
        source: "'brane-fuchs-skrybd'|#$'nicht unterstutzt'|^^^",
      })
    ).to.equal("'brane-fuchs-skrybd'|#$'nicht unterstutzt'|^^^");
  });

  it("Returns svelte compiled down to js", () => {
    const lInput = fs.readFileSync(
      path.join(__dirname, "fixtures", "svelte-ts.svelte"),
      "utf8"
    );
    const lExpectedOoutput = normalizeSource(
      fs.readFileSync(path.join(__dirname, "fixtures", "svelte.js"), "utf8")
    );

    expect(
      normalizeSource(transpile({ extension: ".svelte", source: lInput }))
    ).to.equal(lExpectedOoutput);
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
      normalizeSource(transpile({ extension: ".ts", source: lInputFixture }))
    ).to.equal(normalizeSource(lTranspiledFixture));
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
      normalizeSource(
        transpile(
          { extension: ".ts", source: lInputFixture },
          lTranspilerOptions
        )
      )
    ).to.equal(lTranspiledFixture);
  });
});
