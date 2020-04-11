const chai = require("chai");
const extract = require("../../src/extract");
const cruiseResultSchema = require("../../src/schema/cruise-result.schema.json");
const normalize = require("../../src/main/options/normalize");
const normalizeResolveOptions = require("../../src/main/resolve-options/normalize");
const cjsRecursiveFixtures = require("./fixtures/cjs-recursive.json");
const deprecationFixtures = require("./fixtures/deprecated-node-module.json");
const bundledFixtures = require("./fixtures/bundled-dependencies.json");
const amdRecursiveFixtures = require("./fixtures/amd-recursive.json");
const tsRecursiveFixtures = require("./fixtures/ts-recursive.json");
const vueFixtures = require("./fixtures/vue.json");
const coffeeRecursiveFixtures = require("./fixtures/coffee-recursive.json");

const expect = chai.expect;

chai.use(require("chai-json-schema"));

function runRecursiveFixture(pFixture) {
  if (!Boolean(pFixture.ignore)) {
    it(pFixture.title, () => {
      const lOptions = normalize(pFixture.input.options);
      const lResolveOptions = normalizeResolveOptions(
        {
          bustTheCache: true
        },
        lOptions
      );
      let lResult = extract(
        [pFixture.input.fileName],
        lOptions,
        lResolveOptions
      );

      expect(lResult).to.be.jsonSchema(cruiseResultSchema);
      expect(lResult.modules).to.deep.equal(pFixture.expected);
    });
  }
}

describe("extract/index - CommonJS recursive - ", () =>
  cjsRecursiveFixtures.forEach(runRecursiveFixture));
describe("extract/index - Deprecation - ", () =>
  deprecationFixtures.forEach(runRecursiveFixture));
describe("extract/index - Bundled - ", () =>
  bundledFixtures.forEach(runRecursiveFixture));
describe("extract/index - AMD recursive - ", () =>
  amdRecursiveFixtures.forEach(runRecursiveFixture));
describe("extract/index - TypeScript recursive - ", () =>
  tsRecursiveFixtures.forEach(runRecursiveFixture));
describe("extract/index - vue - ", () =>
  vueFixtures.forEach(runRecursiveFixture));
describe("extract/index - CoffeeScript recursive - ", () =>
  coffeeRecursiveFixtures.forEach(runRecursiveFixture));

/* eslint node/global-require: 0*/
