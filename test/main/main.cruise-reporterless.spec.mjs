import { expect, use } from "chai";
import chaiJSONSchema from "chai-json-schema";
import { cruise } from "../../src/main/index.js";
import cruiseResultSchema from "../../src/schema/cruise-result.schema.js";
import { createRequireJSON } from "../backwards.utl.mjs";

const requireJSON = createRequireJSON(import.meta.url);

const commonjsFixtures = requireJSON(
  "./__fixtures__/cruise-reporterless/commonjs.json"
);
const deprecationFixtures = requireJSON(
  "./__fixtures__/cruise-reporterless/deprecated-node-module.json"
);
const bundledFixtures = requireJSON(
  "./__fixtures__/cruise-reporterless/bundled-dependencies.json"
);
const amdFixtures = requireJSON("./__fixtures__/cruise-reporterless/amd.json");
const typeScriptFixtures = requireJSON(
  "./__fixtures__/cruise-reporterless/typescript.json"
);
const vueFixtures = requireJSON("./__fixtures__/cruise-reporterless/vue.json");
const coffeeFixtures = requireJSON(
  "./__fixtures__/cruise-reporterless/coffee.json"
);
const metricsFixtures = requireJSON(
  "./__fixtures__/cruise-reporterless/metrics.json"
);
const folderFixtures = requireJSON(
  "./__fixtures__/cruise-reporterless/folder.json"
);

use(chaiJSONSchema);

function runFixture(pFixture) {
  if (!Boolean(pFixture.ignore)) {
    it(pFixture.title, () => {
      let lResult = cruise(
        [pFixture.input.fileName],
        { forceDeriveDependents: true, ...pFixture.input.options },
        {
          bustTheCache: true,
          resolveLicenses: true,
          resolveDeprecations: true,
        }
      ).output;

      expect(lResult).to.be.jsonSchema(cruiseResultSchema);
      expect(lResult.modules).to.deep.equal(pFixture.expected);
      if (lResult.folders) {
        expect(lResult.folders).to.deep.equal(pFixture.expectedFolders);
      }
    });
  }
}

describe("[E] main.cruise - reporterless - CommonJS - ", () =>
  commonjsFixtures.forEach(runFixture));
describe("[E] main.cruise - reporterless - AMD - ", () =>
  amdFixtures.forEach(runFixture));
describe("[E] main.cruise - reporterless - TypeScript - ", () =>
  typeScriptFixtures.forEach(runFixture));
describe("[E] main.cruise - reporterless - Vue - ", () =>
  vueFixtures.forEach(runFixture));
describe("[E] main.cruise - reporterless - CoffeeScript - ", () =>
  coffeeFixtures.forEach(runFixture));
describe("[E] main.cruise - reporterless - Deprecation - ", () =>
  deprecationFixtures.forEach(runFixture));
describe("[E] main.cruise - reporterless - Bundled - ", () =>
  bundledFixtures.forEach(runFixture));
describe("[E] main.cruise - reporterless - metrics - ", () =>
  metricsFixtures.forEach(runFixture));
describe("[E] main.cruise - reporterless - folder rules - ", () =>
  folderFixtures.forEach(runFixture));
