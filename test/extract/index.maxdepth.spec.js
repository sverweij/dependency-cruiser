const chai = require("chai");
const extract = require("../../src/extract");
const resultSchema = require("../../src/schema/cruise-result.schema.json");
const normalize = require("../../src/main/options/normalize");
const normalizeResolveOptions = require("../../src/main/resolve-options/normalize");

const expect = chai.expect;

chai.use(require("chai-json-schema"));

describe("extract/index - max depth", () => {
  /* eslint no-magic-numbers:0 */
  [0, 1, 2, 4].forEach(pDepth =>
    it(`returns the correct graph when max-depth === ${pDepth}`, () => {
      const lOptions = normalize({
        maxDepth: pDepth
      });
      const lResolveOptions = normalizeResolveOptions(
        {
          bustTheCache: true
        },
        lOptions
      );
      const lResult = extract(
        ["./test/extract/fixtures/maxDepth/index.js"],
        lOptions,
        lResolveOptions
      );
      /* eslint import/no-dynamic-require:0, security/detect-non-literal-require:0 */

      expect(lResult.modules).to.deep.equal(
        require(`./fixtures/maxDepth${pDepth}.json`).modules
      );
      expect(lResult).to.be.jsonSchema(resultSchema);
    })
  );
});
/* eslint node/global-require: 0*/
