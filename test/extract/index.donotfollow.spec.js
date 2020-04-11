const chai = require("chai");
const extract = require("../../src/extract");
const cruiseResultSchema = require("../../src/schema/cruise-result.schema.json");
const normalize = require("../../src/main/options/normalize");
const normalizeResolveOptions = require("../../src/main/resolve-options/normalize");

const expect = chai.expect;

chai.use(require("chai-json-schema"));

describe("extract/index - do not follow", () => {
  it("do not follow - doNotFollow.path", () => {
    const lOptions = normalize({
      doNotFollow: {
        path: "donotfollowonceinthisfolder"
      }
    });
    const lResolveOptions = normalizeResolveOptions(
      {
        bustTheCache: true
      },
      lOptions
    );
    const lResult = extract(
      ["./test/extract/fixtures/donotfollow/index.js"],
      lOptions,
      lResolveOptions
    );

    expect(lResult.modules).to.deep.equal(
      require("./fixtures/donotfollow.json").modules
    );
    expect(lResult).to.be.jsonSchema(cruiseResultSchema);
  });

  it("do not follow - doNotFollow.dependencyTypes", () => {
    const lOptions = normalize({
      doNotFollow: {
        dependencyTypes: ["npm-no-pkg"]
      }
    });
    const lResolveOptions = normalizeResolveOptions(
      {
        bustTheCache: true
      },
      lOptions
    );
    const lResult = extract(
      ["./test/extract/fixtures/donotfollow-dependency-types/index.js"],
      lOptions,
      lResolveOptions
    );

    expect(lResult.modules).to.deep.equal(
      require("./fixtures/donotfollow-dependency-types.json").modules
    );
    expect(lResult).to.be.jsonSchema(cruiseResultSchema);
  });
});

/* eslint node/global-require: 0*/
