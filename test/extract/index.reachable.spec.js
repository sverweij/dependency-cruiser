const chai = require("chai");
const extract = require("../../src/extract");
const cruiseResultSchema = require("../../src/schema/cruise-result.schema.json");
const normalize = require("../../src/main/options/normalize");
const normalizeRuleSet = require("../../src/main/rule-set/normalize");
const normalizeResolveOptions = require("../../src/main/resolve-options/normalize");

const expect = chai.expect;

chai.use(require("chai-json-schema"));

describe("extract/index - reachable", () => {
  it(`returns output complying to the cruise-result schema when having reachability rules in`, () => {
    const lOptions = normalize({
      validate: true,
      ruleSet: normalizeRuleSet({
        forbidden: [
          {
            name: "no-unreachable-from-root",
            from: {
              path: "src/index.js$",
            },
            to: {
              path: "src",
              reachable: false,
            },
          },
        ],
      }),
    });
    const lResolveOptions = normalizeResolveOptions(
      {
        bustTheCache: true,
      },
      lOptions
    );
    const lResult = extract(
      ["./test/extract/fixtures/reachable"],
      lOptions,
      lResolveOptions
    );

    expect(lResult).to.be.jsonSchema(cruiseResultSchema);
  });
});
/* eslint node/global-require: 0*/
