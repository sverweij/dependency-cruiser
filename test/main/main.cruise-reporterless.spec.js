const chai = require("chai");
const { cruise } = require("../../src/main");
const cruiseResultSchema = require("../../src/schema/cruise-result.schema.json");
const commonjsFixtures = require("./fixtures/cruise-reporterless/commonjs.json");
const deprecationFixtures = require("./fixtures/cruise-reporterless/deprecated-node-module.json");
const bundledFixtures = require("./fixtures/cruise-reporterless/bundled-dependencies.json");
const amdFixtures = require("./fixtures/cruise-reporterless/amd.json");
const typeScriptFixtures = require("./fixtures/cruise-reporterless/typescript.json");
const vueFixtures = require("./fixtures/cruise-reporterless/vue.json");
const coffeeFixtures = require("./fixtures/cruise-reporterless/coffee.json");

const { expect } = chai;

chai.use(require("chai-json-schema"));

function runRecursiveFixture(pFixture) {
  if (!Boolean(pFixture.ignore)) {
    it(pFixture.title, () => {
      let lResult = cruise(
        [pFixture.input.fileName],
        { ...pFixture.input.options, forceDeriveDependents: true },
        {
          bustTheCache: true,
          resolveLicenses: true,
          resolveDeprecations: true,
        }
      ).output;

      expect(lResult).to.be.jsonSchema(cruiseResultSchema);
      expect(lResult.modules).to.deep.equal(pFixture.expected);
    });
  }
}

describe("main.cruise - reporterless - CommonJS - ", () =>
  commonjsFixtures.forEach(runRecursiveFixture));
describe("main.cruise - reporterless - AMD - ", () =>
  amdFixtures.forEach(runRecursiveFixture));
describe("main.cruise - reporterless - TypeScript - ", () =>
  typeScriptFixtures.forEach(runRecursiveFixture));
describe("main.cruise - reporterless - Vue - ", () =>
  vueFixtures.forEach(runRecursiveFixture));
describe("main.cruise - reporterless - CoffeeScript - ", () =>
  coffeeFixtures.forEach(runRecursiveFixture));
describe("main.cruise - reporterless - Deprecation - ", () =>
  deprecationFixtures.forEach(runRecursiveFixture));
describe("main.cruise - reporterless - Bundled - ", () =>
  bundledFixtures.forEach(runRecursiveFixture));

/* eslint node/global-require: 0*/
