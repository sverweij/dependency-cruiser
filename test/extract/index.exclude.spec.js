const fs = require("fs");
const chai = require("chai");
const extract = require("../../src/extract");
const { normalizeCruiseOptions } = require("../../src/main/options/normalize");
const normalizeResolveOptions = require("../../src/main/resolve-options/normalize");

const expect = chai.expect;

chai.use(require("chai-json-schema"));

describe("extract/index - exclude", () => {
  it("exclude - exclude.path", () => {
    const lOptions = normalizeCruiseOptions({
      exclude: {
        path: "dynamic-to-circular",
      },
    });
    const lResolveOptions = normalizeResolveOptions(
      {
        bustTheCache: true,
      },
      lOptions
    );
    const lResult = extract(
      ["./test/extract/fixtures/exclude/path/es/src"],
      lOptions,
      lResolveOptions
    );

    expect(lResult).to.deep.equal(
      require("./fixtures/exclude/path/es/output.json")
    );
  });

  it("exclude - exclude.dynamic", () => {
    const lOptions = normalizeCruiseOptions({
      exclude: {
        dynamic: true,
      },
    });
    const lResolveOptions = normalizeResolveOptions(
      {
        bustTheCache: true,
      },
      lOptions
    );
    const lResult = extract(
      ["./test/extract/fixtures/exclude/dynamic/es/src"],
      lOptions,
      lResolveOptions
    );

    expect(lResult).to.deep.equal(
      require("./fixtures/exclude/dynamic/es/output.json")
    );
  });

  it("exclude - invalid", () => {
    const lOptions = normalizeCruiseOptions({
      exclude: {
        path: "index.js",
      },
    });
    const lResolveOptions = normalizeResolveOptions(
      {
        bustTheCache: true,
      },
      lOptions
    );
    expect(
      fs
        .lstatSync("./test/extract/fixtures/exclude/invalid/index.js")
        .isSymbolicLink()
    ).to.equal(true);
    const lResult = extract(
      ["./test/extract/fixtures/exclude/invalid"],
      lOptions,
      lResolveOptions
    );

    expect(lResult).to.deep.equal([]);
  });
});

/* eslint node/global-require: 0*/
