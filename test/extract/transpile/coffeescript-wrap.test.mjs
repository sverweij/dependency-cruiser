import { strictEqual } from "node:assert";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import normalizeNewline from "normalize-newline";
import coffeescriptWrap from "../../../src/extract/transpile/coffeescript-wrap.mjs";

const wrap = coffeescriptWrap();
const litWrap = coffeescriptWrap(true);

describe("[I] coffeescript transpiler", () => {
  it("tells the coffeescript transpiler is available", () => {
    strictEqual(wrap.isAvailable(), true);
  });

  it("tells the transpiler for literate coffeescript is available", () => {
    strictEqual(litWrap.isAvailable(), true);
  });

  it("transpiles coffeescript", () => {
    strictEqual(
      normalizeNewline(
        wrap.transpile(
          readFileSync(
            "./test/extract/transpile/__mocks__/coffee.coffee",
            "utf8"
          )
        )
      ),

      readFileSync("./test/extract/transpile/__fixtures__/coffee.js", "utf8")
    );
  });

  it("transpiles literate coffeescript", () => {
    strictEqual(
      normalizeNewline(
        litWrap.transpile(
          readFileSync(
            "./test/extract/transpile/__mocks__/litcoffee.litcoffee",
            "utf8"
          )
        )
      ),

      readFileSync("./test/extract/transpile/__fixtures__/litcoffee.js", "utf8")
    );
  });

  it("transpiles literate coffeescript in markdown", () => {
    strictEqual(
      normalizeNewline(
        litWrap.transpile(
          readFileSync(
            "./test/extract/transpile/__mocks__/markdownlitcoffee.coffee.md",
            "utf8"
          )
        )
      ),

      readFileSync(
        "./test/extract/transpile/__fixtures__/markdownlitcoffee.js",
        "utf8"
      )
    );
  });

  it("transpiles jsx'y coffeescript", () => {
    strictEqual(
      normalizeNewline(
        wrap.transpile(
          readFileSync("./test/extract/transpile/__mocks__/csx.cjsx", "utf8")
        )
      ),

      readFileSync("./test/extract/transpile/__fixtures__/csx.jsx", "utf8")
    );
  });
});
