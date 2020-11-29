const fs = require("fs");
const { expect } = require("chai");
const normalizeSource = require("../normalize-source.utl");
const wrap = require("../../../src/extract/transpile/babel-wrap");

describe("extract/transpile/babel-wrap", () => {
  it("tells the babel transpiler is available", () => {
    expect(wrap.isAvailable()).to.equal(true);
  });

  it("transpiles with babel when no babel options are passed", () => {
    expect(
      normalizeSource(
        wrap.transpile(
          fs.readFileSync(
            "./test/extract/transpile/fixtures/babel-in.js",
            "utf8"
          )
        )
      )
    ).to.equal(
      fs.readFileSync(
        "./test/extract/transpile/fixtures/babel-out-no-options.js",
        "utf8"
      )
    );
  });

  it("transpiles with babel differently when babel options are passed", () => {
    const lInputFileContents = fs.readFileSync(
      "./test/extract/transpile/fixtures/babel-in.js",
      "utf8"
    );
    const lBabelOptions = {
      babelConfig: {
        babelrc: false,
        plugins: ["@babel/plugin-transform-modules-commonjs"],
      },
    };
    const lOutput = normalizeSource(
      wrap.transpile(lInputFileContents, lBabelOptions)
    );
    const lExpected = fs.readFileSync(
      "./test/extract/transpile/fixtures/babel-out-es-old.js",
      "utf8"
    );

    expect(lOutput).to.equal(lExpected);
  });
});
