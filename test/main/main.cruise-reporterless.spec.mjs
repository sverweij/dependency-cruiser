import { expect, use } from "chai";
import chaiJSONSchema from "chai-json-schema";
import { cruise } from "../../src/main/index.js";
import cruiseResultSchema from "../../src/schema/cruise-result.schema.js";
import { createRequireJSON } from "../backwards.utl.mjs";

const requireJSON = createRequireJSON(import.meta.url);

const commonjsFixtures = requireJSON(
  "./fixtures/cruise-reporterless/commonjs.json"
);
const deprecationFixtures = requireJSON(
  "./fixtures/cruise-reporterless/deprecated-node-module.json"
);
const bundledFixtures = requireJSON(
  "./fixtures/cruise-reporterless/bundled-dependencies.json"
);
const amdFixtures = requireJSON("./fixtures/cruise-reporterless/amd.json");
const typeScriptFixtures = requireJSON(
  "./fixtures/cruise-reporterless/typescript.json"
);
const vueFixtures = requireJSON("./fixtures/cruise-reporterless/vue.json");
const coffeeFixtures = requireJSON(
  "./fixtures/cruise-reporterless/coffee.json"
);

use(chaiJSONSchema);

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
