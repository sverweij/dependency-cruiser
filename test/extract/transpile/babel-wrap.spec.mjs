import { equal } from "node:assert/strict";
import { readFileSync } from "node:fs";
import normalizeSource from "../normalize-source.utl.mjs";
import wrap from "#extract/transpile/babel-wrap.mjs";

describe("[I] extract/transpile/babel-wrap", () => {
  it("tells the babel transpiler is available", () => {
    equal(wrap.isAvailable(), true);
  });

  it("transpiles with babel when no babel options are passed", async () => {
    const lOutput = await normalizeSource(
      wrap.transpile(
        readFileSync("./test/extract/transpile/__mocks__/babel-in.js", "utf8"),
      ),
    );
    equal(
      lOutput,
      readFileSync(
        "./test/extract/transpile/__fixtures__/babel-out-no-options.js",
        "utf8",
      ),
    );
  });

  it("transpiles with babel differently when babel options are passed", async () => {
    const lInputFileContents = readFileSync(
      "./test/extract/transpile/__mocks__/babel-in.js",
      "utf8",
    );
    const lBabelOptions = {
      babelConfig: {
        babelrc: false,
        plugins: ["@babel/plugin-transform-modules-commonjs"],
      },
    };
    const lOutput = await normalizeSource(
      wrap.transpile(
        lInputFileContents,
        "/test/extract/transpile/__mocks__/babel-in.js",
        lBabelOptions,
      ),
    );
    const lExpected = readFileSync(
      "./test/extract/transpile/__fixtures__/babel-out-es-old.js",
      "utf8",
    );

    equal(lOutput, lExpected);
  });
});
