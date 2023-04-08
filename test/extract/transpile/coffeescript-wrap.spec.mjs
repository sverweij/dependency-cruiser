import { readFileSync } from "node:fs";
import { expect } from "chai";
import normalizeNewline from "normalize-newline";
import coffeescriptWrap from "../../../src/extract/transpile/coffeescript-wrap.mjs";

const wrap = coffeescriptWrap();
const litWrap = coffeescriptWrap(true);

describe("[I] coffeescript transpiler", () => {
  it("tells the coffeescript transpiler is available", () => {
    expect(wrap.isAvailable()).to.equal(true);
  });

  it("tells the transpiler for literate coffeescript is available", () => {
    expect(litWrap.isAvailable()).to.equal(true);
  });

  it("transpiles coffeescript", () => {
    expect(
      normalizeNewline(
        wrap.transpile(
          readFileSync(
            "./test/extract/transpile/__mocks__/coffee.coffee",
            "utf8"
          )
        )
      )
    ).to.equal(
      readFileSync("./test/extract/transpile/__fixtures__/coffee.js", "utf8")
    );
  });

  it("transpiles literate coffeescript", () => {
    expect(
      normalizeNewline(
        litWrap.transpile(
          readFileSync(
            "./test/extract/transpile/__mocks__/litcoffee.litcoffee",
            "utf8"
          )
        )
      )
    ).to.equal(
      readFileSync("./test/extract/transpile/__fixtures__/litcoffee.js", "utf8")
    );
  });

  it("transpiles literate coffeescript in markdown", () => {
    expect(
      normalizeNewline(
        litWrap.transpile(
          readFileSync(
            "./test/extract/transpile/__mocks__/markdownlitcoffee.coffee.md",
            "utf8"
          )
        )
      )
    ).to.equal(
      readFileSync(
        "./test/extract/transpile/__fixtures__/markdownlitcoffee.js",
        "utf8"
      )
    );
  });

  it("transpiles jsx'y coffeescript", () => {
    expect(
      normalizeNewline(
        wrap.transpile(
          readFileSync("./test/extract/transpile/__mocks__/csx.cjsx", "utf8")
        )
      )
    ).to.equal(
      readFileSync("./test/extract/transpile/__fixtures__/csx.jsx", "utf8")
    );
  });
});
