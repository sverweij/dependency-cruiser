import { readFileSync } from "fs";
import { expect } from "chai";
import normalizeNewline from "normalize-newline";
import coffeescriptWrap from "../../../src/extract/transpile/coffeescript-wrap.js";

const wrap = coffeescriptWrap();
const litWrap = coffeescriptWrap(true);

describe("coffeescript transpiler", () => {
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
            "./test/extract/transpile/fixtures/coffee.coffee",
            "utf8"
          )
        )
      )
    ).to.equal(
      readFileSync("./test/extract/transpile/fixtures/coffee.js", "utf8")
    );
  });

  it("transpiles literate coffeescript", () => {
    expect(
      normalizeNewline(
        litWrap.transpile(
          readFileSync(
            "./test/extract/transpile/fixtures/litcoffee.litcoffee",
            "utf8"
          )
        )
      )
    ).to.equal(
      readFileSync("./test/extract/transpile/fixtures/litcoffee.js", "utf8")
    );
  });

  it("transpiles literate coffeescript in markdown", () => {
    expect(
      normalizeNewline(
        litWrap.transpile(
          readFileSync(
            "./test/extract/transpile/fixtures/markdownlitcoffee.coffee.md",
            "utf8"
          )
        )
      )
    ).to.equal(
      readFileSync(
        "./test/extract/transpile/fixtures/markdownlitcoffee.js",
        "utf8"
      )
    );
  });

  it("transpiles jsx'y coffeescript", () => {
    expect(
      normalizeNewline(
        wrap.transpile(
          readFileSync("./test/extract/transpile/fixtures/csx.cjsx", "utf8")
        )
      )
    ).to.equal(
      readFileSync("./test/extract/transpile/fixtures/csx.jsx", "utf8")
    );
  });
});
