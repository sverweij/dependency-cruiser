const chai = require("chai");
const extract = require("~/src/extract");
const normalize = require("~/src/main/options/normalize");
const normalizeResolveOptions = require("~/src/main/resolve-options/normalize");

const expect = chai.expect;

chai.use(require("chai-json-schema"));

describe("extract/index - exclude", () => {
  it("exclude - exclude.path", () => {
    const lOptions = normalize({
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
    const lOptions = normalize({
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
});

/* eslint node/global-require: 0*/
