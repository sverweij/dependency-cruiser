import { equal } from "node:assert/strict";
import { readFileSync } from "node:fs";
import normalizeNewline from "normalize-newline";
import coffeescriptWrap from "#extract/transpile/coffeescript-wrap.mjs";

const wrap = coffeescriptWrap();
const litWrap = coffeescriptWrap(true);

describe("[I] coffeescript transpiler", () => {
  it("tells the coffeescript transpiler is available", () => {
    equal(wrap.isAvailable(), true);
  });

  it("tells the transpiler for literate coffeescript is available", () => {
    equal(litWrap.isAvailable(), true);
  });

  it("transpiles coffeescript", () => {
    equal(
      normalizeNewline(
        wrap.transpile(
          readFileSync(
            "./test/extract/transpile/__mocks__/coffee.coffee",
            "utf8",
          ),
        ),
      ),

      readFileSync("./test/extract/transpile/__fixtures__/coffee.js", "utf8"),
    );
  });

  it("transpiles literate coffeescript", () => {
    equal(
      normalizeNewline(
        litWrap.transpile(
          readFileSync(
            "./test/extract/transpile/__mocks__/litcoffee.litcoffee",
            "utf8",
          ),
        ),
      ),

      readFileSync(
        "./test/extract/transpile/__fixtures__/litcoffee.js",
        "utf8",
      ),
    );
  });

  it("transpiles literate coffeescript in markdown", () => {
    equal(
      normalizeNewline(
        litWrap.transpile(
          readFileSync(
            "./test/extract/transpile/__mocks__/markdownlitcoffee.coffee.md",
            "utf8",
          ),
        ),
      ),

      readFileSync(
        "./test/extract/transpile/__fixtures__/markdownlitcoffee.js",
        "utf8",
      ),
    );
  });

  it("transpiles jsx'y coffeescript", () => {
    equal(
      normalizeNewline(
        wrap.transpile(
          readFileSync("./test/extract/transpile/__mocks__/csx.cjsx", "utf8"),
        ),
      ),

      readFileSync("./test/extract/transpile/__fixtures__/csx.jsx", "utf8"),
    );
  });
});
